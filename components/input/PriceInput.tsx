import {
  InputAttributes,
  NumberFormatBaseProps,
  NumericFormat,
} from "react-number-format";
import { Input } from "../ui/input";

export function PriceInput(props: NumberFormatBaseProps<InputAttributes>) {
  return (
    <NumericFormat
      className="text-right"
      placeholder="COP$ 0"
      allowNegative={false}
      prefix="COP$ "
      thousandSeparator=","
      decimalSeparator="."
      decimalScale={2}
      {...props}
      customInput={Input}
    />
  );
}
