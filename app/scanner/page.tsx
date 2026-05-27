"use client";

import Image from "next/image";
import { useState } from "react";
import PageShell from "@/components/PageShell";
import { MANDAL, PAYMENT } from "@/lib/constants";

function buildUpiQrUrl(upiId: string, payeeName: string) {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    cu: "INR",
  });
  const upiLink = `upi://pay?${params.toString()}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(upiLink)}`;
}

export default function ScannerPage() {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <PageShell>
      <div className="animate-fade-in px-4 py-6">
        <div className="card-mandal p-6 text-center">
          <h2 className="font-heading text-xl font-semibold text-maroon">
            PhonePe Scanner
          </h2>
          <p className="mt-2 text-sm text-maroon/70">
            Scan this QR code to pay {MANDAL.name}
          </p>

          <div className="mx-auto mt-6 flex max-w-xs items-center justify-center rounded-2xl border border-gold/40 bg-white p-4 shadow-inner">
            {imageFailed ? (
              PAYMENT.upiId ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={buildUpiQrUrl(PAYMENT.upiId, PAYMENT.payeeName)}
                  alt="PhonePe payment QR code"
                  width={280}
                  height={280}
                  className="h-auto w-full max-w-[280px]"
                />
              ) : (
                <div className="flex h-[280px] w-[280px] items-center justify-center rounded-lg bg-maroon/5 px-4 text-sm text-maroon/70">
                  Add your PhonePe QR image or UPI ID to display the scanner
                </div>
              )
            ) : (
              <Image
                src={PAYMENT.qrImagePath}
                alt="PhonePe payment QR code"
                width={280}
                height={280}
                className="h-auto w-full max-w-[280px] rounded-lg"
                onError={() => setImageFailed(true)}
                priority
              />
            )}
          </div>

          {PAYMENT.upiId ? (
            <p className="mt-4 text-sm font-medium text-maroon">
              UPI ID: <span className="text-saffron">{PAYMENT.upiId}</span>
            </p>
          ) : (
            <p className="mt-4 text-sm text-maroon/70">
              Add your PhonePe QR at{" "}
              <code className="rounded bg-maroon/5 px-1.5 py-0.5 text-xs">
                public/phonepe-qr.png
              </code>{" "}
              or set{" "}
              <code className="rounded bg-maroon/5 px-1.5 py-0.5 text-xs">
                NEXT_PUBLIC_UPI_ID
              </code>
            </p>
          )}

          <p className="mt-6 text-xs text-maroon/60">
            Open PhonePe, Google Pay, or any UPI app and scan to pay.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
