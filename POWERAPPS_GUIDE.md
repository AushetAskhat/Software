# Low-code версия в Power Apps: пошагово (≈30–40 мин)

> Формулы ниже даны для **русской локали** (как на вашем скриншоте): аргументы разделяются `;`, цепочки действий `;;`.
> В английской локали замените `;` на `,` и `;;` на `;`.

## 0. Создать приложение
make.powerapps.com → **Создать** → **Создать с нуля** (Canvas app) → формат «Планшет».
Название: `SmartCampus_Availability_LowCode`. **Засеките время (setup).**

## 1. Данные: App → OnStart
Выделите `App` в дереве слева → свойство **OnStart**:

```
ClearCollect(colBookings;
    {Id: "BK-1"; Title: "Algorithms seminar"; BStart: DateTime(2027;3;15;9;0;0);  BEnd: DateTime(2027;3;15;10;30;0)};
    {Id: "BK-2"; Title: "Robotics club";      BStart: DateTime(2027;3;15;12;0;0); BEnd: DateTime(2027;3;15;13;0;0)};
    {Id: "BK-3"; Title: "Thesis defence";     BStart: DateTime(2027;3;15;15;0;0); BEnd: DateTime(2027;3;15;16;0;0)}
);;
Set(varSnapshot; JSON(colBookings; JSONFormat.IndentFour));;
Set(varMsg; "Select a future start time and duration.")
```
Потом нажмите `…` у App → **Запустить OnStart**.

## 2. Контролы (Вставка → …)
| Имя контрола | Тип | Настройки |
|---|---|---|
| `dpStart` | Выбор даты (Date picker) | — |
| `drpHour` | Раскрывающийся список | Items: `Sequence(24; 0)` |
| `drpMinute` | Раскрывающийся список | Items: `[0; 15; 30; 45]` |
| `txtDuration` | Текстовое поле | Format: Number, HintText: `1 – 120` |
| `tglBlocked` | Переключатель | Text/подпись: «Room is blocked» |
| `tglTestMode` | Переключатель | подпись: «Test mode (now = 2027-03-14 18:00)» |
| `btnCheck` | Кнопка | Text: `"Check"` |
| `lblResult` | Надпись (Label) | см. ниже |
| `galBookings` | Пустая вертикальная коллекция | Items: `colBookings` |
| `lblT8` | Надпись | см. ниже |

## 3. Логика: btnCheck → OnSelect
```
Set(varNow; If(tglTestMode.Value; DateTime(2027;3;14;18;0;0); Now()));;
Set(varStart; DateAdd(DateAdd(dpStart.SelectedDate; drpHour.Selected.Value; TimeUnit.Hours); drpMinute.Selected.Value; TimeUnit.Minutes));;
Set(varDur; IfError(Value(txtDuration.Text); Blank()));;
Set(varEnd; DateAdd(varStart; varDur; TimeUnit.Minutes));;
Set(varConflict; LookUp(colBookings; varStart < BEnd && varEnd > BStart));;
If(
    IsBlank(dpStart.SelectedDate);
        Set(varAvail; false);; Set(varCode; "INVALID_INPUT");; Set(varMsg; "Please enter a valid start date and time.");
    IsBlank(varDur) || varDur <> RoundDown(varDur; 0);
        Set(varAvail; false);; Set(varCode; "INVALID_DURATION");; Set(varMsg; "Duration must be a whole number of minutes.");
    varStart <= varNow;
        Set(varAvail; false);; Set(varCode; "PAST_TIME");; Set(varMsg; "Start time must be in the future.");
    varDur <= 0 || varDur > 120;
        Set(varAvail; false);; Set(varCode; "INVALID_DURATION");; Set(varMsg; "Duration must be greater than 0 and at most 120 minutes.");
    tglBlocked.Value;
        Set(varAvail; false);; Set(varCode; "BLOCKED");; Set(varMsg; "Unavailable: the room is blocked by administration.");
    !IsBlank(varConflict);
        Set(varAvail; false);; Set(varCode; "OVERLAP");; Set(varMsg; "Unavailable: overlaps with """ & varConflict.Title & """.");
    Set(varAvail; true);; Set(varCode; "OK");; Set(varMsg; "Available: room is free " & Text(varStart; "yyyy-mm-dd hh:mm") & "–" & Text(varEnd; "hh:mm") & " (" & varDur & " min).")
)
```
Порядок проверок такой же, как в коде: сначала валидация, потом блокировка, потом пересечение. Смежные интервалы не пересекаются, потому что сравнения строгие (`<`, `>`).

## 4. Вывод
- `lblResult.Text`: `varMsg & Char(10) & "available=" & varAvail & " · reasonCode=" & varCode`
- `lblResult.Color`: `If(varCode = "OK"; Color.Green; varCode = "BLOCKED" || varCode = "OVERLAP"; Color.Red; Color.DarkOrange)`
- В `galBookings` на шаблоне — Label с Text: `ThisItem.Id & " · " & Text(ThisItem.BStart; "yyyy-mm-dd hh:mm") & "–" & Text(ThisItem.BEnd; "hh:mm") & " · " & ThisItem.Title`
- `lblT8.Text`: `If(JSON(colBookings; JSONFormat.IndentFour) = varSnapshot; "T8: bookings unchanged ✔"; "T8: bookings CHANGED ✘")`

Надпись в Power Apps выводит текст как текст, а не как HTML, поэтому XSS через `lblResult` невозможен. (Не используйте для вывода контрол **HTML text**.)

## 5. Прогон T1–T8 (включите Test mode!)
Для каждого теста заполните поля → **Check** → скриншот (F5 = предпросмотр).

| ID | dpStart | Час | Мин | Длительность | Blocked | Ожидаемо |
|---|---|---|---|---|---|---|
| T1 | 15.03.2027 | 10 | 45 | 60 | off | Available / OK |
| T2 | 15.03.2027 | 12 | 30 | 60 | off | Unavailable / OVERLAP |
| T3 | 15.03.2027 | 10 | 45 | 60 | **on** | Unavailable / BLOCKED |
| T4 | 15.03.2027 | 10 | 45 | 0 | off | INVALID_DURATION |
| T5 | 15.03.2027 | 10 | 45 | 121 | off | INVALID_DURATION |
| T6 | 14.03.2027 | 9 | 0 | 60 | off | PAST_TIME |
| T7 | 15.03.2027 | 13 | 0 | 120 | off | Available / OK |
| T8 | — | — | — | — | — | `lblT8` = unchanged ✔ |

> Если `drpMinute` не даёт 45 (зависит от Items), проверьте, что Items = `[0; 15; 30; 45]`.

## 6. Что записать как ограничения платформы (для отчёта)
- Нет встроенного выбора времени в Date picker: время собрано из двух dropdown (шаг 15 мин). Это **упрощение** по сравнению с кодом (там шаг 1 мин).
- Автотестов нет: тесты прогоняются вручную (Power Apps Test Studio существует, но в этой работе не использовался).
- Если вы что-то не успели или не смогли сделать, **прямо так и напишите** в REPORT.md (требование преподавателя: «Clearly label incomplete or simulated low-code behavior»).

## 7. Экспорт / версионирование
Файл → **Сохранить как** → «Этот компьютер» → получится `.msapp`. Положите его в репозиторий в папку `lowcode/`.
Опубликуйте: Файл → **Опубликовать**. Для ссылки на демо: **Поделиться** (только конкретным людям, не «всем в организации», это тоже пункт безопасности).
