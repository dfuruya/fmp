import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const Spinner = ({
  loading,
  children,
}) => {
  return (
    <Spin spinning={loading} indicator={antIcon}>
      {children}
    </Spin>
  )
}

export default Spinner
