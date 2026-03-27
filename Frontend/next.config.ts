import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    transpilePackages: ["antd", "@ant-design/icons", "rc-util", "rc-pagination", "rc-picker", "rc-tree", "rc-table"],
};

export default nextConfig;
