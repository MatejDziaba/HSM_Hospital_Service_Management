import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, phone, message } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: "matejdziaba@gmail.com",
      subject: "Nová žiadosť o prístup",
      text: `Email: ${email}\nTelefón: ${phone}\nSpráva: ${message}`,
      html: `
        <h3>Nová žiadosť o prístup</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefón:</strong> ${phone}</p>
        <p><strong>Správa:</strong> ${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
