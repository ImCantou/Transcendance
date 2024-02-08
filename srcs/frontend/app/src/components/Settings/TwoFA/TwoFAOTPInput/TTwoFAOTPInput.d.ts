import React from "react";

export type TwoFAOTPInputProps = {
	OTP: string;
	setOTP: (value: React.SetStateAction<string>) => void;
	callBack: (otp: string) => void;
};
