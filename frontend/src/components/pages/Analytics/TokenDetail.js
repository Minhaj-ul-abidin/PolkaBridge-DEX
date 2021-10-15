import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  useTokenChartData,
  useTokenData,
  useTokenPairs,
  useTokenPriceData,
  useTokenTransactions,
} from "../../../contexts/TokenData";
import { useEffect } from "react/cjs/react.development";
import { usePrevious } from "react-use";
import { useDataForList } from "../../../contexts/PairData";
import { formattedNum } from "../../../utils/formatters";
import { formattedPercent } from "../../../utils/timeUtils";
import TokenLogo from "../../common/Styled/TokenLogo";
import TokenIcon from "../../common/TokenIcon";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../../utils/helper";
import TokenChart from "./TokenChart";
import { Card } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  background: {
    padding: 30,
  },
  breadcrumbs: {
    paddingBottom: 20,
  },
  breadcrumbsTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: 400,
  },
  tokenDetails: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  tokenTitle: {
    color: "white",
    fontSize: 32,
  },
  tokenImage: {
    height: 30,
    marginRight: 10,
  },
  changeIndicator: {
    background: "green",
    color: "white",
    fontSize: 12,
    marginLeft: 10,
    borderRadius: 7,
    padding: "4px 8px 4px 8px",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 400,
    color: "white",
    paddingTop: 5,
    paddingBottom: 10,
  },
  liquidityCard: {
    height: 120,
    width: "100%",
    borderRadius: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 10,
    border: "1px solid #616161",
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
  },
  cardTitle: {
    color: "white",
    fontSize: 14,
    textAlign: "left",
    paddingBottom: 7,
  },
  cardValue: {
    color: "white",
    fontSize: 26,
    textAlign: "left",
  },
  cardChangeIndicator: {
    color: "green",
    fontSize: 12,
  },
  chartsCard: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 10,
    border: "1px solid #616161",
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
  },
}));

function TokenPage({ address }) {
  const {
    id,
    name,
    symbol,
    priceUSD,
    oneDayVolumeUSD,
    totalLiquidityUSD,
    volumeChangeUSD,
    oneDayVolumeUT,
    volumeChangeUT,
    priceChangeUSD,
    liquidityChangeUSD,
    oneDayTxns,
    txnChange,
  } = useTokenData(address);

  const allPairs = useTokenPairs(address);

  // pairs to show in pair list
  const fetchedPairsList = useDataForList(allPairs);

  // all transactions with this token
  const transactions = useTokenTransactions(address);

  // price
  const price = priceUSD ? formattedNum(priceUSD, true) : "";
  const priceChange = priceChangeUSD ? formattedPercent(priceChangeUSD) : "";

  // volume
  const volume = formattedNum(
    !!oneDayVolumeUSD ? oneDayVolumeUSD : oneDayVolumeUT,
    true
  );

  const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUT;
  const volumeChange = formattedPercent(
    !usingUtVolume ? volumeChangeUSD : volumeChangeUT
  );

  // liquidity
  const liquidity = formattedNum(totalLiquidityUSD, true);
  const liquidityChange = formattedPercent(liquidityChangeUSD);

  // transactions
  const txnChangeFormatted = formattedPercent(txnChange);

  const classes = useStyles();
  return (
    <div className="container">
      <div className={classes.background}>
        <div for="breadcrumbs" className={classes.breadcrumbs}>
          <h6 className={classes.breadcrumbsTitle}>
            Tokens →{" "}
            <span>
              {symbol}
              <a
                style={{ color: "#DF097C", paddingLeft: 5 }}
                target="_blank"
                href={`https://rinkeby.etherscan.io/address/${id}`}
              >
                ({id && id.slice(0, 8)})
              </a>
            </span>
          </h6>
        </div>
        <div for="token-details" className={classes.tokenDetails}>
          <h1 className={classes.tokenTitle}>
            <TokenIcon
              symbol={symbol}
              address={id}
              className={classes.tokenImage}
            />
            <span style={{ paddingRight: 3 }}>{name}</span>
            <span style={{ paddingRight: 15 }}>({symbol})</span>
            <span>${formatCurrency(priceUSD)}</span>
            <span className={classes.changeIndicator}>
              ${formatCurrency(priceUSD)}
            </span>
          </h1>
        </div>
        <div for="token-stats">
          <h6 className={classes.sectionTitle}>Token Statistics</h6>
          <div className="row">
            <div className="col-md-4">
              <Card elevation={10} className={classes.liquidityCard}>
                <h6 className={classes.cardTitle}>Total Liquidity</h6>
                <div className="d-flex justify-content-between">
                  <h6 className={classes.cardValue}>
                    {formatCurrency(totalLiquidityUSD)}
                  </h6>
                  <p className={classes.cardChangeIndicator}>
                    2{liquidityChangeUSD}%
                  </p>
                </div>
              </Card>
              <Card elevation={10} className={classes.liquidityCard}>
                <h6 className={classes.cardTitle}>Volume (24Hrs)</h6>
                <div className="d-flex justify-content-between">
                  <h6 className={classes.cardValue}>{volume}</h6>
                  <p className={classes.cardChangeIndicator}>
                    3{volumeChangeUSD}%
                  </p>
                </div>
              </Card>
              <Card elevation={10} className={classes.liquidityCard}>
                <h6 className={classes.cardTitle}>Fees (24hrs)</h6>
                <div className="d-flex justify-content-between">
                  <h6 className={classes.cardValue}>{volume}</h6>
                  <p className={classes.cardChangeIndicator}>
                    4{liquidityChangeUSD}%
                  </p>
                </div>
              </Card>
            </div>
            <div className="col-md-8">
              <Card elevation={10} className={classes.chartsCard}>
                <div>
                  <TokenChart
                    address={address}
                    color={"#E0077D"}
                    base={priceUSD}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div for="transaction-table" className="mt-5">
          <h6 className={classes.sectionTitle}>Top Pairs</h6>
          <div>Put Table Here</div>
        </div>
      </div>
    </div>
  );
}
export default TokenPage;
