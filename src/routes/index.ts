import { NextResponse, type NextRequest } from 'next/server';
import { execSync } from 'child_process';
import launchEditor from 'launch-editor';
import path from 'path';
import { mergeManifest } from '../helpers';

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
    GET: (request: NextRequest, { params: { kiwi } }: { params: { kiwi: string[] } }) => {
      const fullPath = kiwi.join('/');
      if (fullPath === 'live') {
        const mergedManifest = mergeManifest(manifest);

        return NextResponse.json(mergedManifest, { headers: corsHeaders });
      }

      if (fullPath === 'live/editor') {
        const root = path.resolve();
        const url = new URL(request.url);
        const fileName = url.searchParams.get('file') as string;

        launchEditor(`${root}/src/${fileName}`, undefined);

        return NextResponse.json({}, { headers: corsHeaders });
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
