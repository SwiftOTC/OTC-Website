import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import one from "./assets/one.svg";
import two from "./assets/two.svg";
import three from "./assets/three.svg";
import four from "./assets/four.svg";
import five from "./assets/five.svg";
import six from "./assets/six.svg";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row",
  "& .MuiAccordionSummary-expandIconWrapper": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(-90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const Faq = () => {
  const [expanded, setExpanded] = useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className="mt-5 container-fluid faq-wrapper px-0 mb-5" id="faq">
      <div className="container-lg">
        <h1 className="text-white font-organetto faqitem-title m-0">
          <mark className="bg-transparent quicktitle font-organetto">FAQ</mark>
        </h1>
      </div>
      <div className="otc-bottom-blue-wrapper customwrapper">
        <div className="container-lg">
          <div className="d-grid">
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography>
                  <img src={one} alt="" className="numberImg"/>
                  <h1 className="text-white font-organetto faqitem-title m-0">
                    What is{" "}
                    <mark className="bg-transparent quicktitle-faq font-organetto">
                      SwiftOTC
                    </mark>
                  </h1>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <span className="faq-desc">
                    SwiftOTC is an Over-the-Counter (OTC) trading platform that
                    allows users to buy and sell cryptocurrencies directly with
                    each other, without the need for a central exchange.
                  </span>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                aria-controls="panel2d-content"
                id="panel2d-header"
              >
                <Typography>
                  <img src={two} alt=""  className="numberImg"/>
                  <h1 className="text-white font-organetto faqitem-title m-0">
                    How does SwiftOTC{" "}
                    <mark className="bg-transparent quicktitle-faq font-organetto">
                      work?
                    </mark>
                  </h1>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <span className="faq-desc">
                    SwiftOTC matches buyers and sellers of cryptocurrencies
                    based on their trading preferences, such as price and
                    volume. On the Sell tab, you can input the token contract
                    you want to sell, choose the price and the token you want to
                    exchange, then approve and deposit the transaction to
                    successfully place your order. Once a match is found, the
                    platform facilitates the transfer of funds and
                    cryptocurrencies between the parties.
                  </span>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
            >
              <AccordionSummary
                aria-controls="panel3d-content"
                id="panel3d-header"
              >
                <img src={three} alt=""  className="numberImg"/>
                <h1 className="text-white font-organetto faqitem-title m-0">
                  Is SwiftOTC{" "}
                  <mark className="bg-transparent quicktitle-faq font-organetto">
                    safe to use?
                  </mark>
                </h1>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <span className="faq-desc">
                    Yes, SwiftOTC is safe to use. There is no registration
                    required, and you do not need to share your personal
                    details. We do not hold your funds; all exchanges take place
                    instantly once a buyer is found. Additionally, all smart
                    contracts are audited and secured, and the platform is
                    monitored 24/7 by CertiK, a leading blockchain security
                    firm, to ensure the safety of your transactions.
                  </span>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel4"}
              onChange={handleChange("panel4")}
            >
              <AccordionSummary
                aria-controls="panel4d-content"
                id="panel4d-header"
              >
                <img src={four} alt="" className="numberImg" />
                <h1 className="text-white font-organetto faqitem-title m-0">
                  What cryptocurrencies can I
                  <mark className="bg-transparent quicktitle-faq font-organetto">
                    trade on SwiftOTC?
                  </mark>
                </h1>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <span className="faq-desc">
                    SwiftOTC supports a wide range of cryptocurrencies,
                    including Bitcoin, Ethereum, BNB, USDT, and many others. New
                    cryptocurrencies are regularly added based on user demand.
                  </span>
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === "panel5"}
              onChange={handleChange("panel5")}
            >
              <AccordionSummary
                aria-controls="panel5d-content"
                id="panel5d-header"
              >
                <img src={five} alt="" className="numberImg" />
                <h1 className="text-white font-organetto faqitem-title m-0">
                  Are there any
                  <mark className="bg-transparent quicktitle-faq font-organetto">
                    fees for using SwiftOTC?
                  </mark>
                </h1>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <span className="faq-desc">
                    We commit to full transparency and make all the fees clear:
                    SwiftOTC charges a 1% fee for each trade, which will be paid
                    by the party who initiates the order. This fee covers the
                    costs of running the platform and ensures that we can
                    continue to provide a secure and reliable trading experience
                    for our users.
                  </span>
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === "panel6"}
              onChange={handleChange("panel6")}
            >
              <AccordionSummary
                aria-controls="panel6d-content"
                id="panel6d-header"
              >
                <img src={six} alt="" className="numberImg"/>
                <h1 className="text-white font-organetto faqitem-title m-0">
                  How can I contact
                  <mark className="bg-transparent quicktitle-faq font-organetto">
                    customer support for SwiftOTC?
                  </mark>
                </h1>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <span className="faq-desc">
                    You can contact SwiftOTC customer support through the
                    platform's website, by sending an email to{" "}
                    <a
                      href="mailto:support@swiftotc.io"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "inherit" }}
                    >
                      support@swiftotc.com,
                    </a>
                    or by joining our Telegram group at{" "}
                    <a
                      href="https://t.me/swiftotc_official"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "inherit" }}
                    >
                      @swiftotc_official.
                    </a>{" "}
                    Our support team is available 24/7 to assist you, with an
                    estimated response time of 24 hours for email inquiries and
                    Telegram messages.
                  </span>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
