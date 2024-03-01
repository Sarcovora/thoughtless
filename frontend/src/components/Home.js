import MaxWidthWrapper from "./MaxWidthWrapper";
import NavigationBar from "./Navigation";

export default function Home() {
  return (
      <div>
        <NavigationBar/>
        <MaxWidthWrapper>
          <h1 className="text-4xl font-bold text-center mt-10">Welcome to the Home Page</h1>
          <p className="py-2 font-light">We don't have a homepage yet lol</p>
          <p className="font-bold">:)</p>
        </MaxWidthWrapper>
      </div>
  );
}
