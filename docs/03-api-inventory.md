# 03 — API Inventory & Classification
**Phase:** Phase 2 (API Inventory + Classification)
**Date:** 2026-08-31

This document classifies all 132 API requests discovered in Phase 1. Classification drives safety requirements (SR-03) and test strategy.

| ID | Folder | Method | URL Pattern | Auth | Dyn Vars | Dependencies | Mutates | Safety | Strategy | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 001 | 01 · Health & Diagnostics | `GET` | `{{baseUrl}}/` | None | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 002 | 01 · Health & Diagnostics | `GET` | `{{baseUrl}}/video-conversion/health` | None | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 003 | 01 · Health & Diagnostics | `GET` | `{{baseUrl}}/iptv-packages/ping` | None | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 004 | 01 · Health & Diagnostics | `GET` | `{{baseUrl}}/iptv-packages/test` | None | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 005 | 01 · Health & Diagnostics | `GET` | `{{baseUrl}}/customers/test-no-auth` | None | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 006 | 01 · Health & Diagnostics | `GET` | `{{baseUrl}}/customers/test` | None | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 007 | 01 · Health & Diagnostics | `GET` | `{{baseUrl}}/api/docs` | None | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 008 | 02 · Auth | `POST` | `{{baseUrl}}/auth/login` | None | - | - | No | `SAFE` | `DEDICATED_TEST` | - |
| 009 | 02 · Auth | `POST` | `{{baseUrl}}/auth/login` | None | - | - | No | `SAFE` | `DEDICATED_TEST` | - |
| 010 | 02 · Auth | `POST` | `{{baseUrl}}/auth/customer/login` | None | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 011 | 02 · Auth | `POST` | `{{baseUrl}}/auth/customer/login` | None | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 012 | 02 · Auth | `POST` | `{{baseUrl}}/auth/register` | Bearer | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 013 | 02 · Auth | `POST` | `{{baseUrl}}/auth/register/user` | None | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 014 | 02 · Auth | `GET` | `{{baseUrl}}/auth/me` | None | - | - | No | `SAFE` | `DEDICATED_TEST` | - |
| 015 | 03 · Resellers | `GET` | `{{baseUrl}}/resellers` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 016 | 03 · Resellers | `GET` | `{{baseUrl}}/resellers/stats` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 017 | 03 · Resellers | `GET` | `{{baseUrl}}/resellers/{{resellerId}}` | Bearer | resellerId | resellerId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 018 | 03 · Resellers | `POST` | `{{baseUrl}}/resellers` | Bearer | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 019 | 03 · Resellers | `PUT` | `{{baseUrl}}/resellers/add-credit` | Bearer | - | - | Yes | `EXTERNAL_SIDE_EFFECT` | `WORKFLOW_ONLY` | Financial / State transition |
| 020 | 03 · Resellers | `PUT` | `{{baseUrl}}/resellers/{{resellerId}}` | Bearer | resellerId | resellerId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 021 | 03 · Resellers | `PUT` | `{{baseUrl}}/resellers/{{resellerId}}/status` | Bearer | resellerId | resellerId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 022 | 03 · Resellers | `DELETE` | `{{baseUrl}}/resellers/{{resellerId}}` | Bearer | resellerId | resellerId | Yes | `DESTRUCTIVE` | `WORKFLOW_ONLY` | - |
| 023 | 04 · Users | `GET` | `{{baseUrl}}/users` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 024 | 04 · Users | `GET` | `{{baseUrl}}/users/stats` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 025 | 04 · Users | `GET` | `{{baseUrl}}/users/{{customerId}}` | Bearer | customerId | customerId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 026 | 05 · Customers — Management | `POST` | `{{baseUrl}}/customers` | Bearer | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 027 | 05 · Customers — Management | `GET` | `{{baseUrl}}/customers` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 028 | 05 · Customers — Management | `GET` | `{{baseUrl}}/customers/reseller/{{resellerId}}` | Bearer | resellerId | resellerId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 029 | 05 · Customers — Management | `GET` | `{{baseUrl}}/customers/{{customerId}}` | Bearer | customerId | customerId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 030 | 05 · Customers — Management | `PUT` | `{{baseUrl}}/customers/{{customerId}}` | Bearer | customerId | customerId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 031 | 05 · Customers — Management | `PUT` | `{{baseUrl}}/customers/{{customerId}}/status` | Bearer | customerId | customerId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 032 | 05 · Customers — Management | `POST` | `{{baseUrl}}/customers/{{customerId}}/renew` | Bearer | customerId | customerId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 033 | 05 · Customers — Management | `PUT` | `{{baseUrl}}/customers/{{customerId}}/password` | Bearer | customerId | customerId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 034 | 05 · Customers — Management | `DELETE` | `{{baseUrl}}/customers/{{customerId}}` | Bearer | customerId | customerId | Yes | `DESTRUCTIVE` | `WORKFLOW_ONLY` | - |
| 035 | 06 · Customers — Account (self) | `GET` | `{{baseUrl}}/customers/info` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 036 | 06 · Customers — Account (self) | `GET` | `{{baseUrl}}/customers/stats` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 037 | 06 · Customers — Account (self) | `PUT` | `{{baseUrl}}/customers/change-password` | Bearer | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 038 | 07 · Customers — Playlists | `GET` | `{{baseUrl}}/customers/playlists` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 039 | 07 · Customers — Playlists | `GET` | `{{baseUrl}}/customers/playlist` | Bearer | - | - | No | `SAFE` | `ALIAS_SKIP` | Legacy endpoint |
| 040 | 07 · Customers — Playlists | `POST` | `{{baseUrl}}/customers/playlists` | Bearer | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 041 | 07 · Customers — Playlists | `POST` | `{{baseUrl}}/customers/{{customerId}}/playlists` | Bearer | customerId | customerId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 042 | 07 · Customers — Playlists | `GET` | `{{baseUrl}}/customers/{{customerId}}/playlists` | Bearer | customerId | customerId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 043 | 07 · Customers — Playlists | `PUT` | `{{baseUrl}}/customers/playlists/{{playlistId}}` | Bearer | playlistId | playlistId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 044 | 07 · Customers — Playlists | `POST` | `{{baseUrl}}/customers/playlists/{{playlistId}}/verify-pin` | Bearer | playlistId | playlistId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 045 | 07 · Customers — Playlists | `DELETE` | `{{baseUrl}}/customers/playlists/{{playlistId}}` | Bearer | playlistId | playlistId | Yes | `DESTRUCTIVE` | `WORKFLOW_ONLY` | - |
| 046 | 07 · Customers — Playlists | `GET` | `{{baseUrl}}/customers/debug-iptv-credentials/{{playlistId}}` | Bearer | playlistId | playlistId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 047 | 07 · Customers — Playlists | `POST` | `{{baseUrl}}/playlists/{{playlistId}}` | Bearer | playlistId | playlistId | Yes | `REQUIRES_CLEANUP` | `ALIAS_SKIP` | Legacy endpoint |
| 048 | 07 · Customers — Playlists | `PUT` | `{{baseUrl}}/playlists/{{playlistId}}` | Bearer | playlistId | playlistId | Yes | `REQUIRES_CLEANUP` | `ALIAS_SKIP` | Legacy endpoint |
| 049 | 07 · Customers — Playlists | `DELETE` | `{{baseUrl}}/playlists/{{playlistId}}` | Bearer | playlistId | playlistId | Yes | `DESTRUCTIVE` | `ALIAS_SKIP` | Legacy endpoint |
| 050 | 08 · Customers — Live TV | `GET` | `{{baseUrl}}/customers/iptv/categories?playlist_id={{playlistId}}` | Bearer | playlistId | playlistId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 051 | 08 · Customers — Live TV | `GET` | `{{baseUrl}}/customers/iptv/channels?playlist_id={{playlistId}}&category_id={{categoryId}}` | Bearer | playlistId, categoryId | playlistId, categoryId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 052 | 08 · Customers — Live TV | `GET` | `{{baseUrl}}/customers/iptv/search?playlist_id={{playlistId}}&type=live&q=news` | Bearer | playlistId | playlistId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 053 | 08 · Customers — Live TV | `GET` | `{{baseUrl}}/customers/channels/groups` | Bearer | - | - | No | `SAFE` | `ALIAS_SKIP` | Legacy endpoint |
| 054 | 08 · Customers — Live TV | `GET` | `{{baseUrl}}/customers/channels` | Bearer | - | - | No | `SAFE` | `ALIAS_SKIP` | Legacy endpoint |
| 055 | 08 · Customers — Live TV | `GET` | `{{baseUrl}}/customers/channels/category/News` | Bearer | - | - | No | `SAFE` | `ALIAS_SKIP` | Legacy endpoint |
| 056 | 08 · Customers — Live TV | `GET` | `{{baseUrl}}/customers/channels/{{streamId}}/stream` | Bearer | streamId | streamId | No | `LOAD_RESTRICTED` | `DEFERRED` | Media streaming (high bandwidth) |
| 057 | 09 · Customers — VOD (Movies) | `GET` | `{{baseUrl}}/customers/iptv/vod/categories?playlist_id={{playlistId}}` | Bearer | playlistId | playlistId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 058 | 09 · Customers — VOD (Movies) | `GET` | `{{baseUrl}}/customers/iptv/vod/content?playlist_id={{playlistId}}&category_id={{categoryId}}` | Bearer | playlistId, categoryId | playlistId, categoryId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 059 | 09 · Customers — VOD (Movies) | `GET` | `{{baseUrl}}/customers/iptv/vod/{{vodId}}/details?playlist_id={{playlistId}}` | Bearer | vodId, playlistId | vodId, playlistId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 060 | 09 · Customers — VOD (Movies) | `GET` | `{{baseUrl}}/customers/iptv/vod/{{vodId}}/stream?playlist_id={{playlistId}}` | Bearer | vodId, playlistId | vodId, playlistId | No | `LOAD_RESTRICTED` | `DEFERRED` | Media streaming (high bandwidth) |
| 061 | 09 · Customers — VOD (Movies) | `GET` | `{{baseUrl}}/customers/iptv/vod/{{vodId}}/proxy?playlist_id={{playlistId}}` | Bearer | vodId, playlistId | vodId, playlistId | No | `LOAD_RESTRICTED` | `DEFERRED` | Media streaming (high bandwidth) |
| 062 | 10 · Customers — Series | `GET` | `{{baseUrl}}/customers/iptv/series/categories?playlist_id={{playlistId}}` | Bearer | playlistId | playlistId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 063 | 10 · Customers — Series | `GET` | `{{baseUrl}}/customers/iptv/series/content?playlist_id={{playlistId}}&category_id={{categoryId}}` | Bearer | playlistId, categoryId | playlistId, categoryId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 064 | 10 · Customers — Series | `GET` | `{{baseUrl}}/customers/iptv/series/{{seriesId}}/episodes?playlist_id={{playlistId}}` | Bearer | seriesId, playlistId | seriesId, playlistId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 065 | 10 · Customers — Series | `GET` | `{{baseUrl}}/customers/iptv/series/{{seriesId}}/episodes/{{episodeId}}/stream?playlist_id={{playlistId}}` | Bearer | seriesId, episodeId, playlistId | seriesId, episodeId, playlistId | No | `LOAD_RESTRICTED` | `DEFERRED` | Media streaming (high bandwidth) |
| 066 | 10 · Customers — Series | `GET` | `{{baseUrl}}/customers/iptv/series/{{seriesId}}/episodes/{{episodeId}}/proxy?playlist_id={{playlistId}}` | Bearer | seriesId, episodeId, playlistId | seriesId, episodeId, playlistId | No | `LOAD_RESTRICTED` | `DEFERRED` | Media streaming (high bandwidth) |
| 067 | 11 · Credit Packages & Transactions | `GET` | `{{baseUrl}}/credit-packages` | None | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 068 | 11 · Credit Packages & Transactions | `GET` | `{{baseUrl}}/credit-packages/{{creditPackageId}}` | Bearer | creditPackageId | creditPackageId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 069 | 11 · Credit Packages & Transactions | `POST` | `{{baseUrl}}/credit-packages` | Bearer | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 070 | 11 · Credit Packages & Transactions | `PUT` | `{{baseUrl}}/credit-packages/{{creditPackageId}}` | Bearer | creditPackageId | creditPackageId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 071 | 11 · Credit Packages & Transactions | `DELETE` | `{{baseUrl}}/credit-packages/{{creditPackageId}}` | Bearer | creditPackageId | creditPackageId | Yes | `DESTRUCTIVE` | `WORKFLOW_ONLY` | - |
| 072 | 11 · Credit Packages & Transactions | `GET` | `{{baseUrl}}/credit-packages/stats` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 073 | 11 · Credit Packages & Transactions | `GET` | `{{baseUrl}}/credit-packages/bank-information` | None | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 074 | 11 · Credit Packages & Transactions | `POST` | `{{baseUrl}}/credit-packages/purchase` | Bearer | - | - | Yes | `EXTERNAL_SIDE_EFFECT` | `WORKFLOW_ONLY` | Financial / State transition |
| 075 | 11 · Credit Packages & Transactions | `GET` | `{{baseUrl}}/credit-packages/pending-bank-transfers` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 076 | 11 · Credit Packages & Transactions | `GET` | `{{baseUrl}}/credit-packages/bank-transfers` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 077 | 11 · Credit Packages & Transactions | `GET` | `{{baseUrl}}/credit-packages/transactions/all` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 078 | 11 · Credit Packages & Transactions | `GET` | `{{baseUrl}}/credit-packages/transactions/reseller/{{resellerId}}` | Bearer | resellerId | resellerId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 079 | 11 · Credit Packages & Transactions | `PUT` | `{{baseUrl}}/credit-packages/transactions/{{transactionId}}/status` | Bearer | transactionId | transactionId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 080 | 11 · Credit Packages & Transactions | `POST` | `{{baseUrl}}/credit-packages/credit-requests` | Bearer | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 081 | 11 · Credit Packages & Transactions | `GET` | `{{baseUrl}}/credit-packages/credit-requests` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 082 | 11 · Credit Packages & Transactions | `POST` | `{{baseUrl}}/credit-packages/credit-requests/{{creditRequestId}}/process` | Bearer | creditRequestId | creditRequestId | Yes | `EXTERNAL_SIDE_EFFECT` | `WORKFLOW_ONLY` | Financial / State transition |
| 083 | 11 · Credit Packages & Transactions | `POST` | `{{baseUrl}}/credit-packages/reseller-credit-request` | Bearer | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 084 | 12 · IPTV Packages & Requests | `GET` | `{{baseUrl}}/iptv-packages` | None | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 085 | 12 · IPTV Packages & Requests | `GET` | `{{baseUrl}}/iptv-packages/{{iptvPackageId}}` | None | iptvPackageId | iptvPackageId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 086 | 12 · IPTV Packages & Requests | `POST` | `{{baseUrl}}/iptv-packages` | Bearer | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 087 | 12 · IPTV Packages & Requests | `PUT` | `{{baseUrl}}/iptv-packages/{{iptvPackageId}}` | Bearer | iptvPackageId | iptvPackageId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 088 | 12 · IPTV Packages & Requests | `DELETE` | `{{baseUrl}}/iptv-packages/{{iptvPackageId}}` | Bearer | iptvPackageId | iptvPackageId | Yes | `DESTRUCTIVE` | `WORKFLOW_ONLY` | - |
| 089 | 12 · IPTV Packages & Requests | `GET` | `{{baseUrl}}/iptv-packages/stats` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 090 | 12 · IPTV Packages & Requests | `POST` | `{{baseUrl}}/iptv-packages/requests` | Bearer | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 091 | 12 · IPTV Packages & Requests | `GET` | `{{baseUrl}}/iptv-packages/requests` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 092 | 12 · IPTV Packages & Requests | `GET` | `{{baseUrl}}/iptv-packages/requests/reseller` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 093 | 12 · IPTV Packages & Requests | `POST` | `{{baseUrl}}/iptv-packages/requests/{{iptvRequestId}}/process` | Bearer | iptvRequestId | iptvRequestId | Yes | `EXTERNAL_SIDE_EFFECT` | `WORKFLOW_ONLY` | Financial / State transition |
| 094 | 13 · Subscriptions (`subcription`) | `GET` | `{{baseUrl}}/subcription` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 095 | 13 · Subscriptions (`subcription`) | `GET` | `{{baseUrl}}/subcription/{{subscriptionId}}` | Bearer | subscriptionId | subscriptionId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 096 | 13 · Subscriptions (`subcription`) | `POST` | `{{baseUrl}}/subcription` | Bearer | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 097 | 13 · Subscriptions (`subcription`) | `PUT` | `{{baseUrl}}/subcription/{{subscriptionId}}` | Bearer | subscriptionId | subscriptionId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 098 | 13 · Subscriptions (`subcription`) | `DELETE` | `{{baseUrl}}/subcription/{{subscriptionId}}` | Bearer | subscriptionId | subscriptionId | Yes | `DESTRUCTIVE` | `WORKFLOW_ONLY` | - |
| 099 | 14 · Support Tickets | `POST` | `{{baseUrl}}/support-tickets` | Bearer | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 100 | 14 · Support Tickets | `GET` | `{{baseUrl}}/support-tickets` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 101 | 14 · Support Tickets | `GET` | `{{baseUrl}}/support-tickets/stats` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 102 | 14 · Support Tickets | `GET` | `{{baseUrl}}/support-tickets/reseller/{{resellerId}}` | Bearer | resellerId | resellerId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 103 | 14 · Support Tickets | `GET` | `{{baseUrl}}/support-tickets/{{ticketId}}` | Bearer | ticketId | ticketId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 104 | 14 · Support Tickets | `PUT` | `{{baseUrl}}/support-tickets/{{ticketId}}` | Bearer | ticketId | ticketId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 105 | 14 · Support Tickets | `PUT` | `{{baseUrl}}/support-tickets/{{ticketId}}/status` | Bearer | ticketId | ticketId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 106 | 14 · Support Tickets | `PUT` | `{{baseUrl}}/support-tickets/{{ticketId}}/priority` | Bearer | ticketId | ticketId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 107 | 14 · Support Tickets | `POST` | `{{baseUrl}}/support-tickets/{{ticketId}}/responses` | Bearer | ticketId | ticketId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 108 | 14 · Support Tickets | `GET` | `{{baseUrl}}/support-tickets/{{ticketId}}/responses` | Bearer | ticketId | ticketId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 109 | 14 · Support Tickets | `DELETE` | `{{baseUrl}}/support-tickets/{{ticketId}}` | Bearer | ticketId | ticketId | Yes | `DESTRUCTIVE` | `WORKFLOW_ONLY` | - |
| 110 | 15 · Bank Information | `GET` | `{{baseUrl}}/bank-information` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 111 | 15 · Bank Information | `GET` | `{{baseUrl}}/bank-information/active` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 112 | 15 · Bank Information | `GET` | `{{baseUrl}}/bank-information/{{bankInfoId}}` | Bearer | bankInfoId | bankInfoId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 113 | 15 · Bank Information | `POST` | `{{baseUrl}}/bank-information` | Bearer | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 114 | 15 · Bank Information | `PUT` | `{{baseUrl}}/bank-information/{{bankInfoId}}` | Bearer | bankInfoId | bankInfoId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 115 | 15 · Bank Information | `PATCH` | `{{baseUrl}}/bank-information/{{bankInfoId}}/set-active` | Bearer | bankInfoId | bankInfoId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 116 | 15 · Bank Information | `DELETE` | `{{baseUrl}}/bank-information/{{bankInfoId}}` | Bearer | bankInfoId | bankInfoId | Yes | `DESTRUCTIVE` | `WORKFLOW_ONLY` | - |
| 117 | 16 · Settings | `GET` | `{{baseUrl}}/settings/profile` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 118 | 16 · Settings | `PUT` | `{{baseUrl}}/settings/profile` | Bearer | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 119 | 16 · Settings | `PUT` | `{{baseUrl}}/settings/password` | Bearer | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 120 | 16 · Settings | `GET` | `{{baseUrl}}/settings/stats` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 121 | 16 · Settings | `DELETE` | `{{baseUrl}}/settings/account` | Bearer | - | - | Yes | `DESTRUCTIVE` | `WORKFLOW_ONLY` | - |
| 122 | 17 · Activity Logs | `GET` | `{{baseUrl}}/activity-logs` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 123 | 18 · Error Reports | `POST` | `{{baseUrl}}/error-reports/ingest` | None | - | - | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 124 | 18 · Error Reports | `GET` | `{{baseUrl}}/error-reports/stats` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 125 | 18 · Error Reports | `GET` | `{{baseUrl}}/error-reports/groups` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 126 | 18 · Error Reports | `GET` | `{{baseUrl}}/error-reports/groups/{{errorGroupId}}` | Bearer | errorGroupId | errorGroupId | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 127 | 18 · Error Reports | `PATCH` | `{{baseUrl}}/error-reports/groups/{{errorGroupId}}` | Bearer | errorGroupId | errorGroupId | Yes | `REQUIRES_CLEANUP` | `WORKFLOW_ONLY` | - |
| 128 | 18 · Error Reports | `DELETE` | `{{baseUrl}}/error-reports/groups/{{errorGroupId}}` | Bearer | errorGroupId | errorGroupId | Yes | `DESTRUCTIVE` | `WORKFLOW_ONLY` | - |
| 129 | 19 · Video Conversion (streaming) | `GET` | `{{baseUrl}}/video-conversion/vod/stream?url=http%3A%2F%2Fpanel.example.com%2Fmovie%2Fu%2Fp%2F12345.mkv` | Bearer | - | - | No | `LOAD_RESTRICTED` | `DEFERRED` | Media streaming (high bandwidth) |
| 130 | 19 · Video Conversion (streaming) | `GET` | `{{baseUrl}}/video-conversion/series/stream?url=http%3A%2F%2Fpanel.example.com%2Fseries%2Fu%2Fp%2F67890.mkv` | Bearer | - | - | No | `LOAD_RESTRICTED` | `DEFERRED` | Media streaming (high bandwidth) |
| 131 | 19 · Video Conversion (streaming) | `GET` | `{{baseUrl}}/video-conversion/test?url=http%3A%2F%2Fpanel.example.com%2Fmovie%2Fu%2Fp%2F12345.mp4` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |
| 132 | 20 · Uploads | `GET` | `{{baseUrl}}/uploads/receipts/receipt-example.png` | Bearer | - | - | No | `SAFE` | `WORKFLOW_ONLY` | - |

## Classification Summary
- **SAFE:** Read-only operations or safe authentication.
- **REQUIRES_CLEANUP:** Standard CRUD mutations (POST, PUT, PATCH).
- **DESTRUCTIVE:** Deletion endpoints (permanently excluded from load tests per SR-03).
- **EXTERNAL_SIDE_EFFECT:** Financial transactions, credit processing, ticket state changes.
- **LOAD_RESTRICTED:** Video streams and heavy media proxies (excluded from load scenarios).
