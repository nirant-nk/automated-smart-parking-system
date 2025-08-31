import api from "../lib/api";

export async function getWallet() {
  const res = await api.get("/users/wallet");
  return res.data.data;
}

export async function getWalletTransactions() {
  const res = await api.get("/users/wallet/transactions");
  return res.data.data.transactions;
}