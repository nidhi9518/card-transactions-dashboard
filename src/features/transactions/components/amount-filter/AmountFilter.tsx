import Input from "../../../../common/components/input/Input";

type AmountFilterProps = {
  value?: number;
  onChange: (value: number | undefined) => void;
};

export default function AmountFilter({ value, onChange }: AmountFilterProps) {
  return (
    <Input
      label="Amount Filter"
      placeholder="Amount"
      value={value}
      type="number"
      onChange={(v) => onChange(v === "" ? undefined : Number(v))}
    />
  );
}