import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, organization, message } = await req.json();

    const data = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: ["jonasnygaard96@gmail.com"], 
      subject: `New Contact Form Submission from ${name}`,
      replyTo: email,
      text: `
        Name: ${name}
        Email: ${email}
        Organization: ${organization}
        Message: ${message}
      `,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error });
  }
}
