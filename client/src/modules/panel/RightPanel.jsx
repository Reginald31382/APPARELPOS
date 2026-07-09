import CartDrawer from "../cart/CartDrawer";
import CheckoutDrawer from "../checkout/components/CheckoutDrawer";
import ReceiptDrawer from "../receipt/ReceiptDrawer";

import usePanelStore from "../../store/ui/usePanelStore";

const RightPanel = () => {
  const activePanel = usePanelStore((state) => state.activePanel);

  switch (activePanel) {
    case "checkout":
      return <CheckoutDrawer />;

    case "receipt":
      return <ReceiptDrawer />;

    case "cart":
    default:
      return <CartDrawer />;
  }
};

export default RightPanel;
