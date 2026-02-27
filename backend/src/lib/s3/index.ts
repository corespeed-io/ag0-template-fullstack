import {
	DeleteObjectCommand,
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * S3-compatible storage client using AWS SDK v3
 *
 * Required environment variables:
 * - S3_BUCKET: Bucket name
 * - S3_ACCESS_KEY_ID: Access key
 * - S3_SECRET_ACCESS_KEY: Secret key
 *
 * Optional:
 * - S3_ENDPOINT: Custom endpoint for S3-compatible services (MinIO, R2, etc.)
 * - S3_REGION: AWS region (default: us-east-1)
 */

const S3_BUCKET = Deno.env.get("S3_BUCKET");
const S3_ACCESS_KEY_ID = Deno.env.get("S3_ACCESS_KEY_ID");
const S3_SECRET_ACCESS_KEY = Deno.env.get("S3_SECRET_ACCESS_KEY");
const S3_ENDPOINT = Deno.env.get("S3_ENDPOINT");
const S3_REGION = Deno.env.get("S3_REGION") ?? "us-east-1";

const isConfigured = !!(S3_BUCKET && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY);

if (!isConfigured) {
	console.warn(
		"S3 not fully configured. Storage operations will fail until S3_BUCKET, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY are set.",
	);
}

function createS3Client(): S3Client {
	const config: ConstructorParameters<typeof S3Client>[0] = {
		region: S3_REGION,
		credentials: {
			accessKeyId: S3_ACCESS_KEY_ID ?? "",
			secretAccessKey: S3_SECRET_ACCESS_KEY ?? "",
		},
	};
	if (S3_ENDPOINT) {
		config.endpoint = S3_ENDPOINT;
		config.forcePathStyle = true;
	}
	return new S3Client(config);
}

export const s3 = isConfigured ? createS3Client() : (null as never);

/**
 * Check if S3 is configured and available
 */
export function isS3Configured(): boolean {
	return isConfigured;
}

/**
 * Upload a file to S3
 */
export async function uploadFile(
	key: string,
	data: Uint8Array | string,
	contentType?: string,
): Promise<void> {
	if (!isConfigured) throw new Error("S3 not configured");
	const body = typeof data === "string" ? new TextEncoder().encode(data) : data;
	await s3.send(
		new PutObjectCommand({
			Bucket: S3_BUCKET,
			Key: key,
			Body: body,
			ContentType: contentType,
		}),
	);
}

/**
 * Download a file from S3
 */
export async function downloadFile(key: string): Promise<Uint8Array> {
	if (!isConfigured) throw new Error("S3 not configured");
	const result = await s3.send(
		new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }),
	);
	return new Uint8Array(await result.Body!.transformToByteArray());
}

/**
 * Generate a presigned URL for direct upload/download
 */
export function getPresignedUrl(
	key: string,
	options: { method?: "GET" | "PUT"; expiresIn?: number } = {},
): Promise<string> {
	if (!isConfigured) throw new Error("S3 not configured");
	const command = options.method === "PUT"
		? new PutObjectCommand({ Bucket: S3_BUCKET, Key: key })
		: new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });
	return getSignedUrl(s3, command, {
		expiresIn: options.expiresIn ?? 3600,
	});
}

/**
 * Delete a file from S3
 */
export async function deleteFile(key: string): Promise<void> {
	if (!isConfigured) throw new Error("S3 not configured");
	await s3.send(
		new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }),
	);
}

/**
 * Check if a file exists in S3
 */
export async function fileExists(key: string): Promise<boolean> {
	if (!isConfigured) throw new Error("S3 not configured");
	try {
		await s3.send(
			new HeadObjectCommand({ Bucket: S3_BUCKET, Key: key }),
		);
		return true;
	} catch {
		return false;
	}
}
