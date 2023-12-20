import { NextRequest, NextResponse } from 'next/server';
import { mergeManifestSections } from '../helpers';
import { execSync } from 'child_process';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function LiveRoute(manifest: any) {
  return {
    PATCH: async (_: NextRequest, { params: { kiwi } }: { params: { kiwi: string[] } }) => {
      if (kiwi.join('/') === 'live/manifest') {
        const result = execSync('npx kiwi manifest');

        return NextResponse.json({ result }, { headers: corsHeaders });
      }

      return NextResponse.json({}, { headers: corsHeaders });
    },
    GET: (_: NextRequest, { params: { kiwi } }: { params: { kiwi: string[] } }) => {
      if (kiwi.length === 1 && kiwi[0] === 'live') {
        const mergedManifest = mergeManifestSections(manifest);

        return NextResponse.json(mergedManifest, { headers: corsHeaders });
      }
    },
    POST: async (req: NextRequest, { params: { kiwi } }: { params: { kiwi: string[] } }) => {
      if (kiwi.join('/') === 'live/proxy') {
        const { method, url, headers, body } = await req.json();

        const request = await fetch(url, { method, headers, body });
        const response = await request.json();

        return NextResponse.json(response || {}, { headers: corsHeaders });
      }

      return NextResponse.json({}, { headers: corsHeaders });
    },
    OPTIONS(_: NextRequest) {
      return NextResponse.json({}, { headers: corsHeaders });
    },
  };
}
