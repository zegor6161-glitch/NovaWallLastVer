import type { TrezorConnect as TrezorConnectType } from "@trezor/connect-web";

const getTrezorConnect = async () => {
  if (chrome && chrome.runtime && chrome.runtime.getPlatformInfo) {
    const TrezorConnect = await import("@trezor/connect-webextension");
    await TrezorConnect.default.init({
      manifest: {
        email: "support@terenval.com",
        appUrl: "https://terenval.com/",
      },
      transports: ["BridgeTransport", "WebUsbTransport"],
      connectSrc: "https://connect.trezor.io/9/",
      _extendWebextensionLifetime: true,
    });
    return TrezorConnect.default as TrezorConnectType;
  } else {
    const TrezorConnect = ((await import("@trezor/connect-web")) as any)
      .default;
    const initFunc = TrezorConnect.init ? TrezorConnect : TrezorConnect.default;
    await initFunc.init({
      lazyLoad: true,
      manifest: {
        email: "support@terenval.com",
        appUrl: "https://terenval.com/",
      },
    });
    return initFunc as TrezorConnectType;
  }
};

export default getTrezorConnect;
