import { DayPicker } from "react-day-picker";
import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";

interface CalendarInputProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  errorMessage?: string;
}

const CalendarInput: React.FC<CalendarInputProps> = ({ selectedDate, setSelectedDate, errorMessage }) => {
  return (
    <div className="w-full">
      <div className="flex flex-col">
        <Popover>
          <PopoverTrigger asChild>
            <div>
              <Button
                type="button"
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
              }}
              disabled={(date) =>
                date < new Date()
              }
              className="p-4"
            />
          </PopoverContent>
        </Popover>
        {errorMessage && <span className="text-red-500">{errorMessage}</span>}
      </div>
    </div>
  );
};

export default CalendarInput;
