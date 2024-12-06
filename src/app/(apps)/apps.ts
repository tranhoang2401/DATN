import packageInfo from "../../../package.json";

export const app = {
  version: packageInfo.version,
  name: "AnPhat Cloud",
  description: "AnPhat Smart",
  location: "Hanoi, Vietnam",
  logoUrl: "https://cloud.anphat.ai.vn/logo.png",
  url: "https://cloud.anphat.ai.vn"
};

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const HIS_ROOT = "/giaovien";
const HRM_ROOT = "/hocsinh";
const CMMS_ROOT = "/cosovatchat";
const CALENDAR_ROOT = "/baocao";
const SYSTEM_ROOT = "/hosotruong";
