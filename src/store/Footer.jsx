import React from "react";

function Footer() {
    return (
        <div className="footer">
            <h2>Supported Sites</h2>
            <div className="company-logos-container">
                <div className="company-logos">
                    <img className="logo" src="/assets/Amazon.png" alt="Company Logo 1"  />
                    <img className="logo" src="/assets/AliExpress.png" alt="Company Logo 2" />
                    <img className="logo" src="/assets/Walmart.png" alt="Company Logo 3" />
                    <img className="logo" src="/assets/Shopify.png" alt="Company Logo 4" />
                    <img className="logo" src="/assets/Ebay.png" alt="Company Logo 5" />
                </div>
            </div>
            <p>&copy; 2023 Your E-commerce Store. All rights reserved.</p>
        </div>
    )
}

export default Footer;