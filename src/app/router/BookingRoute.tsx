import { useAccount } from "../../libs/hooks/useAccount";
import BookingPage from "../../pages/Booking/BookingPage";
import CustomerBookingPage from "../../pages/Booking/CustomerBookingPage";
import PageLoader from "../../components/common/PageLoader";

export default function BookingRoute() {
  const { user, isLoadingUser } = useAccount();

  if (isLoadingUser) {
    return <PageLoader />;
  }

  if (user?.role === "CUSTOMER") {
    return <CustomerBookingPage />;
  }

  return <BookingPage />;
}
