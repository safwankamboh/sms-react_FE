import type { ComponentPropsWithoutRef } from "react";
import { classNames } from "../../utils/helpers";

type CardProps = ComponentPropsWithoutRef<"div">;

function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={classNames(
        "border border-slate-200 bg-white shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
