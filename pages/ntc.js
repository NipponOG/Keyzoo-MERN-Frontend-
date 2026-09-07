import React from 'react'
import SetupLayout from "@/components/admin/2fa/SetupLayout";
import SetupHeader from "@/components/admin/2fa/SetupHeader";
import SetupStepper from "@/components/admin/2fa/SetupStepper";
import QRSection from "@/components/admin/2fa/QRSection";
import InfoPanel from "@/components/admin/2fa/InfoPanel";

const ntc = () => {
    
    return (

        <SetupLayout

            header={<SetupHeader />}

            left={<SetupStepper />}

            center={

                <QRSection

                    qrCode={qrCode}

                    expiresIn={expiresIn}

                    minutes={minutes}

                    seconds={seconds}

                    code={code}

                    inputRefs={inputRefs}

                    handleChange={handleChange}

                    handleKeyDown={handleKeyDown}

                    handlePaste={handlePaste}

                    verifyCode={verifyCode}

                    submitting={submitting}

                    error={error}

                    loadQRCode={loadQRCode}

                />

            }

            right={<InfoPanel />}

        />

    );
}

export default ntc