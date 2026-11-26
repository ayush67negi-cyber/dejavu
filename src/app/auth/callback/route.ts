import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Handles email confirmation links, magic links, OAuth returns and password
 * recovery links. Supabase may deliver either a `code` (PKCE) or a
 * `token_hash`+`type` (email OTP). Both are supported.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/app';
  const safeNext = next.startsWith('/') ? next : '/app';

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as 'signup' | 'recovery' | 'invite' | 'email' | 'email_change',
    });
    if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
  }

  return NextResponse.redirect(
    `${origin}/login?notice=${encodeURIComponent(
      'Dieser Link ist abgelaufen oder wurde bereits verwendet. Melde dich an oder fordere einen neuen an.',
    )}`,
  );
}
