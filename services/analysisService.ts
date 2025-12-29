import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface SavedAnalysis {
  id?: string;
  userId: string;
  type: 'mystique' | 'rational' | 'zeri';
  prenom: string;
  dateNaissance?: string;
  input: any; // Les données entrées par l'utilisateur
  output: any; // Les résultats de l'analyse
  createdAt: Date;
}

/**
 * Sauvegarde une analyse dans Firestore
 */
export async function saveAnalysis(analysis: Omit<SavedAnalysis, 'id' | 'createdAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'analyses'), {
      ...analysis,
      createdAt: Timestamp.now()
    });
    console.log('[Firebase] Analysis saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[Firebase] Error saving analysis:', error);
    throw error;
  }
}

/**
 * Récupère toutes les analyses d'un utilisateur
 */
export async function getUserAnalyses(userId: string): Promise<SavedAnalysis[]> {
  try {
    const q = query(
      collection(db, 'analyses'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const analyses: SavedAnalysis[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      analyses.push({
        id: doc.id,
        userId: data.userId,
        type: data.type,
        prenom: data.prenom,
        dateNaissance: data.dateNaissance,
        input: data.input,
        output: data.output,
        createdAt: data.createdAt.toDate()
      });
    });

    console.log(`[Firebase] Found ${analyses.length} analyses for user ${userId}`);
    return analyses;
  } catch (error) {
    console.error('[Firebase] Error getting analyses:', error);
    throw error;
  }
}

/**
 * Récupère les N dernières analyses d'un utilisateur
 */
export async function getRecentAnalyses(userId: string, limit: number = 10): Promise<SavedAnalysis[]> {
  const allAnalyses = await getUserAnalyses(userId);
  return allAnalyses.slice(0, limit);
}
