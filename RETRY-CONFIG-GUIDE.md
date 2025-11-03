# Retry & Availability Configuration Guide

This guide explains how to use the improved **Retry Configuration** and **Availability Configuration** features in the "Start Agent Call Task" operation.

## Overview

The "Start Agent Call Task" operation now has **easy-to-use UI fields** for configuring:
- ✅ **Retry logic** - Automatically retry failed calls
- ✅ **Availability windows** - Only call during specific days/times
- ✅ **Contact timezone** - Respect the contact's timezone

**No more writing JSON manually!** Everything is now configurable through simple form fields.

---

## Retry Configuration

### How to Enable

1. Open the "Start Agent Call Task" operation
2. Click **"Add Retry Settings"** under "Retry Configuration"
3. Toggle **"Enable Retry"** to ON
4. Configure retry parameters:

### Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| **Enable Retry** | Boolean | `false` | Turn retry logic on/off |
| **Max Attempts** | Number (1-10) | `3` | Total attempts (including first call) |
| **Interval (Minutes)** | Number (1-1440) | `60` | Wait time between retries |

### Example Configuration

**Scenario:** Retry failed calls up to 3 times, waiting 30 minutes between attempts

```
Retry Configuration:
  ✓ Enable Retry: ON
  ✓ Max Attempts: 3
  ✓ Interval (Minutes): 30
```

**Result:** If the first call fails, the system will:
1. Wait 30 minutes
2. Try again (attempt 2)
3. If it fails again, wait 30 minutes
4. Try one last time (attempt 3)
5. Give up if all 3 attempts fail

---

## Availability Configuration

### How to Enable

1. Open the "Start Agent Call Task" operation
2. Click **"Add Availability Settings"** under "Availability Configuration"
3. Toggle **"Enable Availability Windows"** to ON
4. Configure when calls are allowed:

### Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| **Enable Availability Windows** | Boolean | `false` | Turn availability restrictions on/off |
| **Days of Week** | Multi-select | Mon-Fri | Days when calls are allowed |
| **Time Windows** | Collection | Empty | Time ranges when calls are allowed |

### Days of Week Options

- Monday
- Tuesday
- Wednesday
- Thursday
- Friday
- Saturday
- Sunday

**Tip:** You can select multiple days!

### Time Windows

Add one or more time windows:

| Field | Format | Example | Description |
|-------|--------|---------|-------------|
| **Start Time** | HH:mm (24-hour) | `09:00` | When calling window starts |
| **End Time** | HH:mm (24-hour) | `17:00` | When calling window ends |

**Multiple Windows:** Click "Add Time Window" to add more windows (e.g., morning and afternoon slots)

### Example Configuration

**Scenario:** Only call Monday-Friday, 9 AM - 12 PM and 2 PM - 5 PM

```
Availability Configuration:
  ✓ Enable Availability Windows: ON
  ✓ Days of Week: Monday, Tuesday, Wednesday, Thursday, Friday

  Time Windows:
    Window 1:
      ✓ Start Time: 09:00
      ✓ End Time: 12:00

    Window 2:
      ✓ Start Time: 14:00
      ✓ End Time: 17:00
```

**Result:** Calls will only be attempted:
- On weekdays (not weekends)
- Between 9 AM - 12 PM or 2 PM - 5 PM
- If a call is scheduled outside these windows, it will wait until the next available time

---

## Contact Timezone

### Purpose

Respects the contact's local timezone when applying availability windows.

### How to Use

Simply enter the contact's timezone in standard format:

| Field | Type | Default | Example |
|-------|------|---------|---------|
| **Contact Timezone** | String | `Europe/Rome` | `America/New_York` |

### Common Timezones

- `Europe/Rome` - Italy
- `Europe/London` - UK
- `America/New_York` - US East Coast
- `America/Los_Angeles` - US West Coast
- `America/Chicago` - US Central
- `Asia/Tokyo` - Japan
- `Australia/Sydney` - Australia

**Full list:** Use [IANA timezone names](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

### Example

If you set:
- Contact Timezone: `America/New_York`
- Time Window: 09:00 - 17:00

The system will call between 9 AM and 5 PM **in New York time**, not your local time!

---

## Complete Example: Business Hours with Retry

### Scenario
Call customers during business hours, with retry logic for failed calls.

### Configuration

**Agent:** Sales Agent (selected from dropdown)

**Contact Phone Number:** `+1234567890`

**Contact Email:** `customer@example.com`

**Contact Name:** `John Doe`

**Contact Timezone:** `America/New_York`

**Retry Configuration:**
```
✓ Enable Retry: ON
✓ Max Attempts: 5
✓ Interval (Minutes): 120
```

**Availability Configuration:**
```
✓ Enable Availability Windows: ON
✓ Days of Week: Monday, Tuesday, Wednesday, Thursday, Friday

Time Windows:
  Window 1:
    ✓ Start Time: 09:00
    ✓ End Time: 12:00

  Window 2:
    ✓ Start Time: 13:00
    ✓ End Time: 17:00
```

### What Happens

1. **First attempt:** System tries to call immediately if within business hours
2. **If outside hours:** Waits until next available window (Mon-Fri, 9 AM-12 PM or 1 PM-5 PM EST)
3. **If call fails:** Waits 2 hours and tries again
4. **Retry logic:** Up to 5 attempts total
5. **All times respect:** America/New_York timezone

---

## Before vs After

### Before (Old UX) 😢

```json
Additional Properties: {
  "retry_configuration": {
    "max_attempts": 3,
    "interval_minutes": 60
  },
  "availability_configuration": {
    "days_of_week": ["MONDAY", "TUESDAY", "WEDNESDAY"],
    "time_windows": [
      {"start": "09:00", "end": "17:00"}
    ]
  },
  "contact_timezone": "Europe/Rome"
}
```

**Problems:**
- ❌ Have to write JSON manually
- ❌ Easy to make syntax errors
- ❌ Not discoverable (how would users know these options exist?)
- ❌ Hard to validate (typos in day names, invalid times)

### After (New UX) 😍

**Visual form fields:**
- ✅ Toggle switches for enable/disable
- ✅ Number inputs with min/max validation
- ✅ Multi-select for days of week
- ✅ Add/remove time windows with buttons
- ✅ Clear labels and descriptions
- ✅ No JSON required!

---

## Tips & Best Practices

### Retry Configuration

✅ **Do:**
- Use 3-5 max attempts for important calls
- Set interval to at least 30 minutes to avoid spam
- Combine with availability windows for respectful calling

❌ **Don't:**
- Set interval too short (< 15 minutes) - might annoy contacts
- Use too many attempts (> 10) - diminishing returns
- Retry without availability windows - might call at 3 AM!

### Availability Configuration

✅ **Do:**
- Always set timezone for the contact's location
- Use business hours (9 AM - 5 PM) as default
- Add lunch break gap if appropriate (12-1 PM)
- Consider weekends for B2C, exclude for B2B

❌ **Don't:**
- Forget to enable both retry AND availability together
- Use 24-hour windows (no one wants 2 AM calls)
- Forget about holidays (system doesn't know about them yet)

### Contact Timezone

✅ **Do:**
- Always set timezone if you know the contact's location
- Use IANA standard names (Europe/Rome, not CET)
- Default to a sensible timezone for your target market

❌ **Don't:**
- Use abbreviations (EST, PST) - not supported
- Leave blank if targeting international customers
- Assume everyone is in your timezone

---

## Troubleshooting

### "Retry not working"

**Check:**
- ✓ "Enable Retry" is toggled ON
- ✓ Max Attempts is > 1
- ✓ Interval is reasonable (> 0)

### "Calls not respecting time windows"

**Check:**
- ✓ "Enable Availability Windows" is toggled ON
- ✓ Time windows are in 24-hour format (HH:mm)
- ✓ Start time is before end time
- ✓ At least one day is selected
- ✓ Contact timezone is correct

### "Time windows not saving"

**Make sure:**
- ✓ You clicked "Add Time Window" first
- ✓ Both start and end times are filled
- ✓ Format is correct (09:00, not 9am)

---

## Advanced: Custom Properties

For additional custom fields not covered by the UI, use the **"Custom Properties (JSON)"** field under Options:

```json
{
  "custom_field_1": "value1",
  "custom_field_2": "value2",
  "metadata": {
    "source": "website",
    "priority": "high"
  }
}
```

These properties will be merged with the other fields and sent to the agent.

---

## API Payload Example

When you configure retry and availability through the UI, here's what gets sent to the API:

```json
{
  "contact_phone_number": "+1234567890",
  "contact_email": "customer@example.com",
  "contact_name": "John Doe",
  "contact_timezone": "America/New_York",
  "retry_configuration": {
    "max_attempts": 3,
    "interval_minutes": 60
  },
  "availability_configuration": {
    "days_of_week": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    "time_windows": [
      {
        "start": "09:00",
        "end": "12:00"
      },
      {
        "start": "13:00",
        "end": "17:00"
      }
    ]
  }
}
```

The UI builds this payload automatically - you don't need to write any JSON!

---

## Summary

The new Retry Configuration and Availability Configuration features make it **much easier** to:

- 📞 Automatically retry failed calls
- ⏰ Only call during appropriate hours
- 🌍 Respect customer timezones
- ✨ Configure everything through a user-friendly UI

**No more JSON editing!** Everything is now point-and-click. 🎉
