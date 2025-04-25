// app/api/vote/[id]/route.ts
import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json({
		errorCode: 200,
		message: "Voted!",
	});
}
