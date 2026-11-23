import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });
    }

    const [regsRes, utrsRes] = await Promise.all([
        supabase
            .from('student_registrations')
            .select('delegate_id, full_name, title, email, phone, cluster_id, payment_receipt_url, academic_batch, admission_year')
            .order('created_at', { ascending: false }),
        supabase.from('participant_utrs').select('*'),
    ]);

    if (regsRes.error) {
        return NextResponse.json({ error: regsRes.error.message }, { status: 500 });
    }
    if (utrsRes.error) {
        return NextResponse.json({ error: utrsRes.error.message }, { status: 500 });
    }

    const utrMap = new Map(
        (utrsRes.data || []).map((u) => [u.delegate_id, u])
    );

    const records = (regsRes.data || []).map((r) => {
        const u = utrMap.get(r.delegate_id);
        return {
            delegateId: r.delegate_id,
            fullName: `${r.title || ''} ${r.full_name}`.trim(),
            email: r.email,
            phone: r.phone,
            academicBatch: r.academic_batch || '',
            admissionYear: r.admission_year || '',
            clusterId: r.cluster_id,
            receiptUrl: r.payment_receipt_url || '',
            utrNumber: u?.utr_number || '',
            isFlagged: Boolean(u?.is_flagged),
            flaggedReason: u?.flagged_reason || '',
        };
    });

    return NextResponse.json({ records }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });
    }

    const { delegateId, utrNumber } = (await req.json()) as {
        delegateId?: string;
        utrNumber?: string;
    };

    const cleanUtr = String(utrNumber || '').trim().toUpperCase();
    if (!delegateId || !cleanUtr) {
        return NextResponse.json(
            { error: 'Delegate ID and UTR number are required.' },
            { status: 400 }
        );
    }

    // 1. Check if this delegate previously had a different UTR (to unflag old partner if needed)
    const { data: prevRow } = await supabase
        .from('participant_utrs')
        .select('utr_number')
        .eq('delegate_id', delegateId)
        .maybeSingle();

    // 2. Check if any OTHER delegate already has this exact UTR
    const { data: matches } = await supabase
        .from('participant_utrs')
        .select('delegate_id')
        .eq('utr_number', cleanUtr)
        .neq('delegate_id', delegateId);

    const isDuplicate = (matches || []).length > 0;
    const flagMsg = isDuplicate
        ? `Duplicate UTR (${cleanUtr}) shared across ${(matches || []).length + 1} delegates`
        : null;

    // 3. Upsert this delegate's UTR in the separate table
    const { error: upsertErr } = await supabase.from('participant_utrs').upsert({
        delegate_id: delegateId,
        utr_number: cleanUtr,
        is_flagged: isDuplicate,
        flagged_reason: flagMsg,
        updated_at: new Date().toISOString(),
    });

    if (upsertErr) {
        return NextResponse.json({ error: upsertErr.message }, { status: 500 });
    }

    // 4. If duplicate found, flag ALL other delegates sharing this UTR as well
    if (isDuplicate) {
        await supabase
            .from('participant_utrs')
            .update({
                is_flagged: true,
                flagged_reason: flagMsg,
                updated_at: new Date().toISOString(),
            })
            .eq('utr_number', cleanUtr);
    }

    // 5. If the delegate's old UTR now has only 1 owner left, automatically unflag it
    if (prevRow?.utr_number && prevRow.utr_number !== cleanUtr) {
        const { data: remaining } = await supabase
            .from('participant_utrs')
            .select('delegate_id')
            .eq('utr_number', prevRow.utr_number);

        if (remaining && remaining.length === 1) {
            await supabase
                .from('participant_utrs')
                .update({ is_flagged: false, flagged_reason: null })
                .eq('delegate_id', remaining[0].delegate_id);
        }
    }

    return NextResponse.json({
        saved: true,
        isDuplicate,
        conflictingDelegateIds: (matches || []).map((m) => m.delegate_id),
    });
}