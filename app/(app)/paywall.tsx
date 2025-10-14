import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import Purchases, { PurchasesPackage, CustomerInfo } from 'react-native-purchases';
import { Platform } from 'react-native';
import { isPurchasesConfigured } from '../../lib/revenuecat';
import Constants from 'expo-constants';
import { useEntitlement } from '../lib/useEntitlement';
import { router } from 'expo-router';

export default function PaywallScreen() {
  const isPro = useEntitlement('pro');
  const devForcePro = ((Constants.expoConfig?.extra as any)?.devForcePro ?? '0') === '1';
  const [offering, setOffering] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPro || devForcePro) {
      router.back();
    }
  }, [isPro]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        if (!isPurchasesConfigured()) {
          setError(Platform.OS === 'ios' ? 'In-app purchases not configured on iOS yet.' : 'Purchases not configured.');
          setOffering(null);
          return;
        }
        const offerings = await Purchases.getOfferings();
        const current = offerings.current || null;
        if (mounted) setOffering(current);
      } catch (e) {
        if (mounted) setError('Unable to load offerings.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const monthly = useMemo<any>(() => offering?.monthly, [offering]);
  const annual = useMemo<any>(() => offering?.annual, [offering]);

  const handlePurchase = async (pkg: PurchasesPackage | undefined) => {
    if (!pkg) return;
    if (!isPurchasesConfigured()) return;
    try {
      setPurchasing(true);
      setError(null);
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      onCustomerInfo(customerInfo);
    } catch (e: any) {
      // Canceled or failure
      if (e?.userCancelled) return;
      setError('Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const onCustomerInfo = (info: CustomerInfo) => {
    if (info.entitlements.active?.pro) {
      router.back();
    }
  };

  const handleRestore = async () => {
    if (!isPurchasesConfigured()) return;
    try {
      setPurchasing(true);
      setError(null);
      const info = await Purchases.restorePurchases();
      onCustomerInfo(info);
    } catch {
      setError('Restore failed. Try again later.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Go Pro</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>Unlock higher LLM limits and premium features.</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          {error && (
            <Text style={styles.error}>{error}</Text>
          )}

          <View style={styles.cards}>
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium">Monthly</Text>
                <Text variant="bodyMedium" style={styles.cardPrice}>{monthly?.product.priceString || '$4.99'}</Text>
                <Button mode="contained" onPress={() => handlePurchase(monthly)} loading={purchasing} disabled={purchasing || !monthly}>
                  Choose Monthly
                </Button>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium">Yearly</Text>
                <Text variant="bodyMedium" style={styles.cardPrice}>{annual?.product.priceString || '$29.99'}</Text>
                <Button mode="contained" onPress={() => handlePurchase(annual)} loading={purchasing} disabled={purchasing || !annual}>
                  Choose Yearly
                </Button>
              </Card.Content>
            </Card>
          </View>

          <Button mode="text" onPress={handleRestore} disabled={purchasing} style={styles.restore}>
            Restore Purchases
          </Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 16,
  },
  cards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    flex: 1,
  },
  cardPrice: {
    marginVertical: 8,
  },
  restore: {
    marginTop: 16,
  },
  error: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 12,
  },
});


