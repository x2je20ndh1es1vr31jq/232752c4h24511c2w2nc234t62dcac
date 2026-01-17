gg.clearResults()
gg.toast("Wait..")
local A9fQ2 = "https://raw.githubusercontent.com/darakubalika/darakubalika.github.io/main/me/sc-otr-h7sh8"
local Zx7P1 = gg.makeRequest(A9fQ2)
if not Zx7P1 or not Zx7P1.content then
gg.alert("Failed load")
os.exit()
end
local M4Kq8 = {73,12,91,44,201}
local P2dS9 = #M4Kq8
local H7Lx3 = Zx7P1.content:gsub("%s+", "")
local Vw8R0 = {}
local C6Jt5 = 1
for U9aE2 = 1, #H7Lx3, 2 do
local YQ4N1 = tonumber(H7Lx3:sub(U9aE2, U9aE2 + 1), 16)
Vw8R0[C6Jt5] = string.char(
bit32.bxor(YQ4N1, M4Kq8[(C6Jt5 - 1) % P2dS9 + 1]))
C6Jt5 = C6Jt5 + 1
end
local R5ZbK = table.concat(Vw8R0)
_G.XPDT3 = "DEWANTI-XMFS7HQ-12"
local W3P0D, L7EJ9 = load(R5ZbK)
if not W3P0D then
gg.alert("Error:\n" .. L7EJ9)
os.exit()
end
W3P0D()