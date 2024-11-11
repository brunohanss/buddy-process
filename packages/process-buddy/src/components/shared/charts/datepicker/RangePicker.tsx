"use client"
 
import * as React from "react"
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
import { DateRange } from "react-day-picker"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"

// Add required plugins
dayjs.extend(advancedFormat)

export function RangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date,] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: dayjs(new Date(2022, 0, 20)).add(20, "day").toDate(),
  })

  return (
    <div className={cn("bg-background grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {dayjs(date.from).format("MMM DD, YYYY")} -{" "}
                  {dayjs(date.to).format("MMM DD, YYYY")}
                </>
              ) : (
                dayjs(date.from).format("MMM DD, YYYY")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {/* <Calendar
            // initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          /> */}
        </PopoverContent>
      </Popover>
    </div>
  )
}