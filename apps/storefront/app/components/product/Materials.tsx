import { Image } from "@shopify/hydrogen-react";
import clsx from "clsx";

export default function Materials() {
  return (
    <div className="materials">
      <p className="bold-56">
        Seriously perfect prints. <br />
        Every. Damn. Time.
      </p>

      <div className="materials-columns">
        <div className="semi-bold-16">
          <img src="/images/printing.jpg" />
          <p className="semi-bold-32">Printing & paper.</p>

          <li>310gsm fine-art cotton.</li>
          <li>Prints that will last a lifetime.</li>
          <li>12 colour giclée prints for unrivalled quality.</li>
          <li>Wide colour gamut makes colours pop.</li>
          <li>Made by hand in our workshop.</li>
        </div>

        <div className="semi-bold-16">
          <img src="/images/framing.jpg" />
          <p className="semi-bold-32">The frame.</p>
          <li>Beautifully crafted from aluminium.</li>
          <li>Optical interference glass reduces glare.</li>
          <li>Available in Jet black, Brushed Silver or Oak. </li>
        </div>
      </div>
    </div>
  );
}
