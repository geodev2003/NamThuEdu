<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * NewsController
 * --------------------------------------------------------------------
 * Aggregate news from Vietnamese press RSS feeds (VnExpress, Tuoi Tre,
 * Thanh Nien...) for student-facing topics. Extracts thumbnail images
 * from the RSS description and caches the result for 15 minutes.
 */
class NewsController extends Controller
{
    /**
     * Each topic maps to a list of RSS feed URLs and an optional
     * keyword filter applied to titles.
     */
    private const TOPICS = [
        'thpt-quoc-gia' => [
            'feeds' => [
                'https://vnexpress.net/rss/giao-duc.rss',
                'https://thanhnien.vn/rss/giao-duc/thi-tot-nghiep-thpt.rss',
                'https://tuoitre.vn/rss/giao-duc.rss',
            ],
            'keywords' => ['thpt', 'tốt nghiệp', 'tuyển sinh', 'đại học', 'thi'],
        ],
        'ielts' => [
            'feeds' => [
                'https://vnexpress.net/rss/giao-duc.rss',
            ],
            'keywords' => ['ielts', 'tiếng anh'],
        ],
        'vstep' => [
            'feeds' => [
                'https://vnexpress.net/rss/giao-duc.rss',
            ],
            'keywords' => ['vstep', 'tiếng anh'],
        ],
        'tieng-anh' => [
            'feeds' => [
                'https://vnexpress.net/rss/giao-duc.rss',
            ],
            'keywords' => ['tiếng anh', 'english'],
        ],
    ];

    /**
     * GET /api/public/news?topic=thpt-quoc-gia&limit=8
     */
    public function index(Request $request)
    {
        $topic = (string) $request->query('topic', 'thpt-quoc-gia');
        $limit = max(1, min(20, (int) $request->query('limit', 8)));

        $config = self::TOPICS[$topic] ?? self::TOPICS['thpt-quoc-gia'];

        $cacheKey = "news.feed.v2.{$topic}.{$limit}";
        $items    = Cache::remember($cacheKey, now()->addMinutes(15), function () use ($config, $limit) {
            return $this->aggregate($config['feeds'], $config['keywords'] ?? [], $limit);
        });

        return response()->json([
            'status' => 'success',
            'data'   => [
                'topic' => $topic,
                'items' => $items,
            ],
        ]);
    }

    /**
     * Fetch multiple RSS feeds, merge & dedupe, sort by published_at desc.
     *
     * @param string[] $feeds
     * @param string[] $keywords case-insensitive title filter (OR)
     * @param int      $limit
     */
    private function aggregate(array $feeds, array $keywords, int $limit): array
    {
        $all = [];

        foreach ($feeds as $url) {
            foreach ($this->fetchFeed($url) as $item) {
                if ($keywords && !$this->matchesKeywords($item['title'], $keywords)) {
                    continue;
                }
                $all[$item['link']] = $item; // dedupe by link
            }
        }

        $items = array_values($all);

        // Sort newest first
        usort($items, fn($a, $b) => strtotime((string)($b['published_at'] ?? 0)) <=> strtotime((string)($a['published_at'] ?? 0)));

        return array_slice($items, 0, $limit);
    }

    private function matchesKeywords(string $title, array $keywords): bool
    {
        $t = mb_strtolower($title, 'UTF-8');
        foreach ($keywords as $kw) {
            if (mb_strpos($t, mb_strtolower($kw, 'UTF-8'), 0, 'UTF-8') !== false) {
                return true;
            }
        }
        return false;
    }

    /**
     * Fetch a single RSS feed and normalize items.
     *
     * @return array<int, array{title:string, link:string, source:string, published_at:?string, description:string, image:?string}>
     */
    private function fetchFeed(string $url): array
    {
        try {
            $response = Http::timeout(8)
                ->withOptions(['verify' => false])
                ->withHeaders(['User-Agent' => 'Mozilla/5.0 NamThuEdu/1.0'])
                ->get($url);

            if (!$response->ok()) {
                Log::warning('NewsController feed failed', ['status' => $response->status(), 'url' => $url]);
                return [];
            }

            $xml = @simplexml_load_string($response->body(), 'SimpleXMLElement', LIBXML_NOCDATA);
            if (!$xml || !isset($xml->channel->item)) {
                return [];
            }

            $sourceName = trim((string) ($xml->channel->title ?? ''));
            if ($sourceName === '') {
                $sourceName = parse_url($url, PHP_URL_HOST) ?: 'Tin tức';
            }

            $items = [];
            foreach ($xml->channel->item as $node) {
                $title       = trim(html_entity_decode((string) $node->title, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
                $link        = trim((string) $node->link);
                $pubDate     = (string) $node->pubDate;
                $description = (string) $node->description;

                // Extract image from description (VnExpress / Tuoi Tre / Thanh Nien
                // typically embed an <img src="..."> at the start of <description>)
                $image = null;
                if (preg_match('/<img[^>]+src=["\']([^"\']+)["\']/i', $description, $m)) {
                    $image = html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');
                }

                // Fallback: media:content or enclosure (RSS extensions)
                if (!$image) {
                    $media = $node->children('media', true);
                    if (isset($media->content)) {
                        $attrs = $media->content->attributes();
                        if (isset($attrs['url'])) {
                            $image = (string) $attrs['url'];
                        }
                    }
                }
                if (!$image && isset($node->enclosure)) {
                    $attrs = $node->enclosure->attributes();
                    if (isset($attrs['url'])) {
                        $image = (string) $attrs['url'];
                    }
                }

                // Clean text description (strip HTML)
                $cleanDesc = trim(strip_tags($description));
                $cleanDesc = preg_replace('/\s+/', ' ', $cleanDesc) ?? '';
                if (mb_strlen($cleanDesc) > 200) {
                    $cleanDesc = mb_substr($cleanDesc, 0, 200) . '…';
                }

                $items[] = [
                    'title'        => $title,
                    'link'         => $link,
                    'source'       => $sourceName,
                    'published_at' => $pubDate ? date('c', strtotime($pubDate)) : null,
                    'description'  => $cleanDesc,
                    'image'        => $image,
                ];
            }

            return $items;
        } catch (\Throwable $e) {
            report($e);
            return [];
        }
    }
}
