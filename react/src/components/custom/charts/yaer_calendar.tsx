import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const months = [
  "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
  "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
];

// Функция генерации дней года с уровнем активности (0–4)
const generateYear = () => {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1);
  const year = [];

  for (let i = 0; i < 365; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    year.push({
      date,
      level: 0, // от 0 до 4
    });
  }

  return year;
};

// Цвета по уровням активности (как GitHub)
const levelColors = [
  "bg-gray-800", // 0
  "bg-green-200", // 1
  "bg-green-400", // 2
  "bg-green-600", // 3
  "bg-green-800", // 4
];

export default function YearCalendar() {
  const [year, setYear] = useState(generateYear);

  // Переключение уровня активности (по клику день увеличивает уровень)
  const toggleDay = (index: number) => {
    setYear((prev) => {
      const updated = [...prev];
      const nextLevel = (updated[index].level + 1) % 5;
      updated[index] = { ...updated[index], level: nextLevel };
      return updated;
    });
  };

  // Разбиваем по неделям
  const weeks: { date: Date; level: number; index: number }[][] = [];
  let currentWeek: { date: Date; level: number; index: number }[] = [];

  let weekday = year[0].date.getDay();
  let offset = weekday === 0 ? 6 : weekday - 1;

  for (let i = 0; i < offset; i++) {
    currentWeek.push({ date: new Date(), level: -1, index: -1 });
  }

  year.forEach((day, idx) => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push({ ...day, index: idx });
  });
  if (currentWeek.length) weeks.push(currentWeek);

  // Получим месяца для подписей сверху
  const monthLabels: { month: string; col: number }[] = [];
  weeks.forEach((week, i) => {
    const firstDay = week.find((d) => d.index !== -1);
    if (firstDay && firstDay.date.getDate() <= 7) {
      monthLabels.push({ month: months[firstDay.date.getMonth()], col: i });
    }
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="text-lg font-semibold">Календарь посещений</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 overflow-x-auto">

          <div className="flex justify-between text-xs text-gray-400">
            {weeks.map((_, i) => {
              const label = monthLabels.find((m) => m.col === i);
              return (
                <div key={i} className="flex-0 w-3 text-center">
                  {label ? label.month : ""}
                </div>
              );
            })}
          </div>

          <div className="flex gap-1">

            <div className="flex flex-col gap-1 mr-2 text-xs opacity-70">
              {days.map((d) => (
                <div key={d} className="h-3 w-3 text-center">
                  {d}
                </div>
              ))}
            </div>

            {/* Сетка недель */}
            {weeks.map((week, i) => (
              <div key={i} className="flex flex-col gap-1">
                {week.map((day, j) => (
                  <TooltipProvider key={j}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`h-3 w-[10px] rounded-none cursor-pointer transition-colors duration-200 ${
                            day.level === -1
                              ? "bg-transparent"
                              : levelColors[day.level]
                          }`}
                          onClick={() => day.index !== -1 && toggleDay(day.index)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {day.index !== -1
                            ? `${day.date.toDateString()} — уровень ${day.level}`
                            : "Нет данных"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            ))}
          </div>

          {/* Легенда */}
          <div className="flex items-center gap-2 justify-end mt-2 text-xs text-gray-400">
            <span>Меньше</span>
            {levelColors.map((c, i) => (
              <div key={i} className={`h-3 w-3 rounded-sm ${c}`} />
            ))}
            <span>Больше</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}