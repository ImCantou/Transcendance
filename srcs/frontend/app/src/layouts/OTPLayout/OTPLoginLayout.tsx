import './OTPLayout.styles.css'

function OTPLoginLayout () {
    return (
        <div className='OTPmain-page'>
            <div className='OTPframe-1'>
                <span className='OTPtext-1'>Enter your One Time Password</span>
                <input/>
            </div>
            <button className='OTPerror-button'>
                <span className='OTPtext-2'>Error: Wrong OTP</span>
            </button>
        </div>
    )
}

export default OTPLoginLayout;
