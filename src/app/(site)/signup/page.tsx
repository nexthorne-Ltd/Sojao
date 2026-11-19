import Link from "next/link";

import { SignupForm } from "@/components/auth-forms";
import { Background } from "@/components/background";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Join the beta",
  description: "Create your Sojao AI account. Marketing automations for Instagram and Messenger, free during the beta.",
  path: "/signup",
});

const Signup = () => {
  return (
    <Background>
      <section className="py-28 lg:pt-44 lg:pb-32">
        <div className="container">
          <div className="flex flex-col gap-4">
            <Card className="mx-auto w-full max-w-sm">
              <CardHeader className="flex flex-col items-center space-y-0">
                <Logo className="mb-7 text-4xl" />
                <p className="mb-2 text-2xl font-bold">Join the beta</p>
                <p className="text-muted-foreground">
                  Sojao Marketing is free during the beta.
                </p>
              </CardHeader>
              <CardContent>
                <SignupForm />
                <p className="text-muted-foreground mt-4 text-center text-xs">
                  By signing up you agree to our{" "}
                  <Link href="/terms" className="underline underline-offset-4">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline underline-offset-4">
                    Privacy Policy
                  </Link>
                  .
                </p>
                <div className="text-muted-foreground mx-auto mt-8 flex justify-center gap-1 text-sm">
                  <p>Already have an account?</p>
                  <Link href="/login" className="text-primary font-medium">
                    Log in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Background>
  );
};

export default Signup;
