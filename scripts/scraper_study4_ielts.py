"""
Scraper danh sách đề thi IELTS General từ study4.com
Chỉ cào danh sách (title, URL, metadata) - không cào nội dung chi tiết đề.

Cài đặt:
    pip install playwright
    playwright install chromium

Chạy:
    python scripts/scraper_study4_ielts.py
"""

import asyncio
import json
import re
from pathlib import Path
from playwright.async_api import async_playwright

# ─── Config ────────────────────────────────────────────────────────────────────
BASE_URL       = "https://study4.com"
LIST_URL       = f"{BASE_URL}/tests/ielts-general/"
OUTPUT_DIR     = Path("scraped_ielts")
OUTPUT_DIR.mkdir(exist_ok=True)
HEADLESS       = True
# ───────────────────────────────────────────────────────────────────────────────


def parse_card_text(raw: str) -> dict:
    """
    Phân tích text của card đề thi.
    VD: 'IELTS General Sample reading test 1\n60 phút | 63633 | 66\n3 phần thi | 40 câu hỏi'
    """
    lines = [l.strip() for l in raw.strip().splitlines() if l.strip()]
    result = {"title": "", "duration": "", "participants": "", "ratings": "",
              "parts": "", "questions": ""}

    if not lines:
        return result

    result["title"] = lines[0]

    for line in lines[1:]:
        # "60 phút | 63633 | 66"  →  duration | participants | ratings
        m = re.match(r'(\d+\s*phút)\s*\|\s*([\d,]+)\s*\|\s*(\d+)', line)
        if m:
            result["duration"]     = m.group(1)
            result["participants"] = m.group(2)
            result["ratings"]      = m.group(3)
            continue

        # "3 phần thi | 40 câu hỏi"
        m2 = re.match(r'(\d+\s*phần thi)\s*\|\s*(\d+\s*câu hỏi)', line)
        if m2:
            result["parts"]     = m2.group(1)
            result["questions"] = m2.group(2)
            continue

        # "60 phút" đơn giản
        if "phút" in line and not result["duration"]:
            result["duration"] = line.split("|")[0].strip()

    return result


async def get_all_pages(page) -> list[dict]:
    """Lấy danh sách đề từ tất cả trang (có pagination)."""
    all_tests = []
    page_num  = 1

    while True:
        url = LIST_URL if page_num == 1 else f"{LIST_URL}?page={page_num}"
        print(f"\n[→] Trang {page_num}: {url}")

        await page.goto(url, wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(2500)

        # Scroll để load lazy images
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(1500)

        # Lấy tất cả links có text dài (card link, không phải "Chi tiết" hay link trống)
        links = await page.query_selector_all("a[href*='/tests/']")
        found_this_page = []
        seen = set()

        for link in links:
            href = await link.get_attribute("href")
            text = (await link.inner_text()).strip()

            # Bỏ qua: link category, link trống, link "Chi tiết", đã thấy
            if not href or not text:
                continue
            if href in ("/tests/ielts-general/", "/tests/ielts/",
                        "/tests/ielts-general/mini/"):
                continue
            if text in ("Chi tiết", "IELTS Academic", "Đề rút gọn"):
                continue
            if len(text) < 10:   # bỏ link icon/image
                continue
            if href in seen:
                continue

            # Chỉ lấy link dạng /tests/<id>/<slug>/
            if not re.match(r'/tests/\d+/', href):
                continue

            seen.add(href)
            parsed = parse_card_text(text)
            parsed["url"] = f"{BASE_URL}{href}"
            found_this_page.append(parsed)

        if not found_this_page:
            print(f"  [i] Không có đề nào → dừng phân trang")
            break

        print(f"  [✓] {len(found_this_page)} đề")
        for t in found_this_page:
            print(f"      • {t['title']}")

        all_tests.extend(found_this_page)

        # Kiểm tra còn trang tiếp không
        next_btn = await page.query_selector("a[aria-label='Next'], a[rel='next'], .pagination .next:not(.disabled)")
        if not next_btn:
            # Thử tìm link page kế tiếp
            next_link = await page.query_selector(f"a[href*='?page={page_num + 1}']")
            if not next_link:
                print(f"  [i] Hết trang")
                break

        page_num += 1
        if page_num > 20:   # giới hạn an toàn
            break
        await page.wait_for_timeout(1500)

    return all_tests


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=HEADLESS,
            args=["--no-sandbox"]
        )
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 900},
        )
        page = await context.new_page()

        tests = await get_all_pages(page)

        await browser.close()

        # ── Lưu kết quả ──────────────────────────────────────────────────────
        out_json = OUTPUT_DIR / "ielts_general_list.json"
        out_json.write_text(
            json.dumps(tests, ensure_ascii=False, indent=2),
            encoding="utf-8"
        )

        # Xuất CSV
        out_csv = OUTPUT_DIR / "ielts_general_list.csv"
        with out_csv.open("w", encoding="utf-8-sig") as f:
            f.write("STT,Tên đề,Thời gian,Số người thi,Đánh giá,Số phần,Số câu,URL\n")
            for i, t in enumerate(tests, 1):
                row = [
                    str(i),
                    t.get("title", "").replace(",", " "),
                    t.get("duration", ""),
                    t.get("participants", ""),
                    t.get("ratings", ""),
                    t.get("parts", ""),
                    t.get("questions", ""),
                    t.get("url", ""),
                ]
                f.write(",".join(row) + "\n")

        print(f"\n{'='*55}")
        print(f"✅ Hoàn tất! Tổng cộng {len(tests)} đề IELTS General")
        print(f"   📄 JSON : {out_json.absolute()}")
        print(f"   📊 CSV  : {out_csv.absolute()}")


if __name__ == "__main__":
    asyncio.run(main())
