import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Auth Error: ' + error.message)}`);
    }
  } else {
    // If no code, maybe an error was passed in URL (e.g., ?error=access_denied)
    const errorDesc = requestUrl.searchParams.get('error_description') || requestUrl.searchParams.get('error');
    if (errorDesc) {
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDesc)}`);
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
