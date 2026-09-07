/**
 * Retries a MongoDB session transaction on transient errors — these occur
 * under write contention, e.g. many concurrent buyers hitting the same
 * event document (exactly the "last seat" race condition scenario).
 *
 * Requires MongoDB running as a replica set; standalone mongod does not
 * support multi-document transactions.
 */
export async function withTransactionRetry(session, fn, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await session.withTransaction(fn);
    } catch (error) {
      const isTransient =
        error.errorLabels?.includes('TransientTransactionError') ||
        error.errorLabels?.includes('UnknownTransactionCommitResult');

      if (!isTransient || attempt === maxRetries) throw error;

      const backoffMs = 50 * attempt;
      await new Promise((resolve) => globalThis.setTimeout(resolve, backoffMs));
    }
  }
}