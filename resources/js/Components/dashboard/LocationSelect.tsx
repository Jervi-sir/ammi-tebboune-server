import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Input } from '@/Components/ui/input';

interface LocationSelectProps {
  location: string;
  setLocation: (value: string) => void;
  wilaya: string;
  setWilaya: (value: string) => void;
}

const wilayas = [
  "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار", "البليدة", "البويرة",
  "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر", "الجلفة", "جيجل", "سطيف", "سعيدة",
  "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة", "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر", "ورقلة",
  "وهران", "البيض", "إليزي", "برج بوعريريج", "بومرداس", "الطارف", "تندوف", "تيسمسيلت", "الوادي", "خنشلة",
  "سوق أهراس", "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت", "غرداية", "غليزان", "تيميمون", "برج باجي مختار",
  "أولاد جلال", "بني عباس", "عين صالح", "عين قزام", "توقرت", "جانت", "المغير", "المنيعة"
];

const LocationSelect: React.FC<LocationSelectProps> = ({ location, setLocation, wilaya, setWilaya }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-2">
      <Input
        type="text"
        placeholder="Location (optional)"
        className="flex-1"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <div className="flex w-full md:w-[unset]">
        <Select value={wilaya} onValueChange={setWilaya}>
          <SelectTrigger>
            <SelectValue placeholder="Wilaya (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Wilaya</SelectLabel>
              {wilayas.map((wilaya, index) => (
                <SelectItem key={index} value={wilaya}>{wilaya}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelect;
