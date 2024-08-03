'use server';

import {  UTApi } from "uploadthing/server";

const utapi = new UTApi({
    apiKey: process.env.UPLOADTHING_API_KEY,
  });

export async function uploadPdfToUploadthing(mypdf: Uint8Array, fileName: string) {
    console.log('📝 Uploading PDF...')

    const blob = new Blob([mypdf], { type: 'application/pdf' });
    
    const file = new File([blob], fileName, { type: 'application/pdf' });

    const response = await utapi.uploadFiles(file);

    if (response.error) {
        console.error('📝 Error uploading PDF:', response.error);
        return response;
    }

    console.log('📝 PDF uploaded successfully:', response.data.url);

    return response;
}

