import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Attendance Control System CBA"
        description="This is the Attendance Control System CBA"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
