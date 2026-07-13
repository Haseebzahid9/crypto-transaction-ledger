import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionApi, walletApi, statsApi, searchApi } from '../services/api';
import toast from 'react-hot-toast';

export const QUERY_KEYS = {
  transactions: ['transactions'],
  transaction: (id) => ['transactions', id],
  wallet: (address) => ['wallet', address],
  stats: ['stats'],
  search: (wallet) => ['search', wallet],
};

export function useTransactions() {
  return useQuery({ queryKey: QUERY_KEYS.transactions, queryFn: transactionApi.getAll });
}

export function useTransaction(id) {
  return useQuery({
    queryKey: QUERY_KEYS.transaction(id),
    queryFn: () => transactionApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: transactionApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success('Transaction created successfully!');
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: transactionApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.stats });
      toast.success('Transaction deleted');
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useVerifyTransaction() {
  return useMutation({ mutationFn: transactionApi.verify });
}

export function useWallet(address) {
  return useQuery({
    queryKey: QUERY_KEYS.wallet(address),
    queryFn: () => walletApi.getBalance(address),
    enabled: !!address,
  });
}

export function useStats() {
  return useQuery({ queryKey: QUERY_KEYS.stats, queryFn: statsApi.get });
}

export function useSearch(wallet) {
  return useQuery({
    queryKey: QUERY_KEYS.search(wallet),
    queryFn: () => searchApi.search(wallet),
    enabled: !!wallet && wallet.trim().length > 0,
  });
}
