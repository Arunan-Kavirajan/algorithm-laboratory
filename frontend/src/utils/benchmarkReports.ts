import type { ExecutionEvent } from '../types';

const ALGORITHM_DATA: Record<string, { time: string, space: string, name: string }> = {
    'bubble_sort': { name: 'Bubble Sort', time: 'O(n²)', space: 'O(1)' },
    'selection_sort': { name: 'Selection Sort', time: 'O(n²)', space: 'O(1)' },
    'insertion_sort': { name: 'Insertion Sort', time: 'O(n²)', space: 'O(1)' },
    'merge_sort': { name: 'Merge Sort', time: 'O(n log n)', space: 'O(n)' },
    'quick_sort': { name: 'Quick Sort', time: 'O(n log n)', space: 'O(log n)' },
    'heap_sort': { name: 'Heap Sort', time: 'O(n log n)', space: 'O(1)' },
};

const rankTime = (t: string) => {
    if (t.includes('n²')) return 3;
    if (t.includes('n log n')) return 2;
    if (t.includes('n')) return 1;
    return 0;
};

interface AgentContext {
    name: string;
    track: string;
    steps: number;
    comp: number;
    swaps: number;
    time: string;
    timeRank: number;
}

interface RaceContext {
    winner: AgentContext;
    loser: AgentContext;
    isTie: boolean;
    speedup: string;
    diff: number;
}

type Template = {
    condition: (c: RaceContext) => boolean;
    generate: (c: RaceContext) => string[];
};

const templates: Template[] = [
    // --- TIE OUTCOMES (3) ---
    {
        condition: c => c.isTie,
        generate: c => [
            `A dead heat in the laboratory. Both ${c.winner.name} and ${c.loser.name} completed the sorting sequence in exactly ${c.winner.steps} steps.`,
            `This indicates an identical operational footprint for this specific randomized dataset. Neither algorithm could break away to secure a definitive advantage.`
        ]
    },
    {
        condition: c => c.isTie,
        generate: c => [
            `A statistical anomaly or a perfect structural match. Track A and Track B finished in a complete tie at ${c.winner.steps} steps.`,
            `When two algorithms finish simultaneously, it highlights how specific dataset arrangements can neutralize theoretical advantages. Both systems performed identical amounts of structural work.`
        ]
    },
    {
        condition: c => c.isTie,
        generate: c => [
            `Neither algorithm yielded an inch. We have a perfect tie across both execution tracks.`,
            `While ${c.winner.name} and ${c.loser.name} may approach partitioning and swapping differently, their overall overhead on this specific dataset evaluated to the exact same operational cost.`
        ]
    },

    // --- UPSET OUTCOMES (Worse complexity wins) (3) ---
    {
        condition: c => !c.isTie && c.winner.timeRank > c.loser.timeRank,
        generate: c => [
            `A fascinating upset in the laboratory! Despite a mathematically inferior theoretical bound of ${c.winner.time} against ${c.loser.time}, ${c.winner.name} secured the victory.`,
            `It executed ${c.speedup}x faster than ${c.loser.name}. This is a prime example of how constant factors, algorithmic overhead, and array size can completely subvert Big-O expectations in the real world.`
        ]
    },
    {
        condition: c => !c.isTie && c.winner.timeRank > c.loser.timeRank,
        generate: c => [
            `Defying theoretical scaling laws, ${c.winner.name} (${c.winner.time}) outpaced ${c.loser.name} (${c.loser.time}) by ${c.diff} steps.`,
            `While Big-O notation predicts long-term trends, ${c.winner.name}'s highly optimized inner loop allowed it to capitalize on the dataset's specific entropy, pulling off a rare algorithmic upset.`
        ]
    },
    {
        condition: c => !c.isTie && c.winner.timeRank > c.loser.timeRank,
        generate: c => [
            `An algorithmic underdog story. Track ${c.winner.track}'s ${c.winner.name} successfully brute-forced a victory over a supposedly superior ${c.loser.time} algorithm.`,
            `By navigating the array in ${c.winner.steps} steps, it proved that on arrays of this specific size and disorder, raw mechanical simplicity can sometimes beat sophisticated divide-and-conquer strategies.`
        ]
    },

    // --- EXPECTED WINS (Better complexity wins) (5) ---
    {
        condition: c => !c.isTie && c.winner.timeRank < c.loser.timeRank,
        generate: c => [
            `A textbook demonstration of algorithmic scaling. ${c.winner.name} leveraged its superior ${c.winner.time} architecture to crush ${c.loser.name} by ${c.diff} steps.`,
            `This ${c.speedup}x speedup visually validates mathematical theory. As the dataset grows, the gap between ${c.winner.time} and ${c.loser.time} will only continue to exponentially widen.`
        ]
    },
    {
        condition: c => !c.isTie && c.winner.timeRank < c.loser.timeRank,
        generate: c => [
            `Theoretical superiority translated directly into a decisive victory. ${c.winner.name} finished significantly ahead of Track ${c.loser.track}.`,
            `By avoiding the exhaustive iterations inherent in ${c.loser.time} algorithms, it bypassed unnecessary work and secured the win with minimal wasted cycles.`
        ]
    },
    {
        condition: c => !c.isTie && c.winner.timeRank < c.loser.timeRank,
        generate: c => [
            `Absolute mathematical dominance. ${c.winner.name} operated exactly as expected, leaving ${c.loser.name} far behind in the execution log.`,
            `The logarithmic efficiency of ${c.winner.time} proved too powerful, requiring only ${c.winner.steps} operations compared to a staggering ${c.loser.steps}.`
        ]
    },
    {
        condition: c => !c.isTie && c.winner.timeRank < c.loser.timeRank,
        generate: c => [
            `A predictable, yet beautiful outcome based on theoretical bounds. ${c.winner.name} outpaced its opponent by a factor of ${c.speedup}x.`,
            `This benchmark perfectly illustrates why ${c.winner.name} is classified in a higher tier of algorithmic efficiency. It intelligently partitioned the workload rather than relying on brute force.`
        ]
    },
    {
        condition: c => !c.isTie && c.winner.timeRank < c.loser.timeRank,
        generate: c => [
            `${c.winner.name}'s architectural advantages were on full display today, terminating the execution ${c.diff} steps earlier than Track ${c.loser.track}.`,
            `When you pit a ${c.winner.time} approach against a ${c.loser.time} approach, the mechanics of the latter simply cannot keep up with the optimized memory access patterns of the former.`
        ]
    },

    // --- SAME COMPLEXITY WINS (4) ---
    {
        condition: c => !c.isTie && c.winner.timeRank === c.loser.timeRank,
        generate: c => [
            `A clash of equals. Despite both algorithms operating within a ${c.winner.time} bound, ${c.winner.name} proved mechanically superior on this dataset.`,
            `When theoretical complexities match, it all comes down to constant factors, implementation overhead, and how gracefully the algorithm handles localized pockets of sorted data.`
        ]
    },
    {
        condition: c => !c.isTie && c.winner.timeRank === c.loser.timeRank,
        generate: c => [
            `In this heavy-weight battle of ${c.winner.time} algorithms, ${c.winner.name} seized the lead and never let go.`,
            `It crossed the finish line in ${c.winner.steps} steps. The ${c.speedup}x performance delta highlights that not all ${c.winner.time} algorithms respond to data entropy in the same way.`
        ]
    },
    {
        condition: c => !c.isTie && c.winner.timeRank === c.loser.timeRank,
        generate: c => [
            `${c.winner.name} narrowly edged out ${c.loser.name} in a strict head-to-head matchup of average-case efficiency.`,
            `Since both share the exact same theoretical ceiling of ${c.winner.time}, Track ${c.winner.track}'s victory was earned through minor operational optimizations and favorable array layout.`
        ]
    },
    {
        condition: c => !c.isTie && c.winner.timeRank === c.loser.timeRank,
        generate: c => [
            `A fascinating side-by-side comparison of ${c.winner.time} philosophies. ${c.winner.name} completed its run saving ${c.diff} total operations.`,
            `Both are highly capable algorithms, but today's randomized numbers slightly favored the specific traversal mechanics utilized by Track ${c.winner.track}.`
        ]
    },

    // --- SPECIFIC MECHANICAL WINS (Comparisons / Swaps / Dominance) (5) ---
    {
        condition: c => !c.isTie && c.winner.swaps < c.loser.swaps && c.winner.comp < c.loser.comp,
        generate: c => [
            `Total execution dominance by ${c.winner.name}. It secured a flawless victory by beating Track ${c.loser.track} in every measurable metric.`,
            `Not only did it execute ${c.speedup}x faster overall, but it achieved this by drastically reducing both algorithmic comparisons (${c.winner.comp} vs ${c.loser.comp}) AND expensive memory writes (${c.winner.swaps} vs ${c.loser.swaps}). A masterclass in efficiency.`
        ]
    },
    {
        condition: c => !c.isTie && c.winner.swaps < c.loser.swaps && c.winner.comp > c.loser.comp,
        generate: c => [
            `${c.winner.name} secured the overall win through extreme memory efficiency, despite performing more conditional comparisons.`,
            `It made ${c.winner.comp} comparisons against ${c.loser.name}'s ${c.loser.comp}, but won the war by limiting heavy array swaps (${c.winner.swaps} vs ${c.loser.swaps}). Memory writes are expensive, and this strategy paid off.`
        ]
    },
    {
        condition: c => !c.isTie && c.winner.comp < c.loser.comp && c.winner.swaps > c.loser.swaps,
        generate: c => [
            `Track ${c.winner.track} claimed victory by acting decisively. ${c.winner.name} performed significantly fewer algorithmic comparisons than its rival.`,
            `Interestingly, it executed more physical array swaps (${c.winner.swaps} vs ${c.loser.swaps}), but its highly optimized search space allowed it to shave off ${c.diff} total steps from the overall execution.`
        ]
    },
    {
        condition: c => !c.isTie && c.winner.comp < c.loser.comp,
        generate: c => [
            `Strict comparison optimization was the deciding factor here. ${c.winner.name} elegantly bypassed unnecessary checks that bogged down Track ${c.loser.track}.`,
            `By making only ${c.winner.comp} comparisons, it proved that asking the right questions is faster than asking all of them, securing a solid ${c.speedup}x operational speedup.`
        ]
    },
    {
        condition: c => !c.isTie && c.winner.swaps < c.loser.swaps,
        generate: c => [
            `A highly tactical win for ${c.winner.name}, built entirely on memory preservation.`,
            `While the two algorithms were highly competitive, Track ${c.winner.track} drastically minimized expensive array mutations (only ${c.winner.swaps} swaps). This write-efficiency compounded step after step, resulting in a solid victory.`
        ]
    }
];

export function generateReport(
    algA: string, 
    algB: string, 
    eventsA: ExecutionEvent[], 
    eventsB: ExecutionEvent[]
): string[] {
    const stepsA = eventsA.length;
    const stepsB = eventsB.length;
    
    const dataA = ALGORITHM_DATA[algA] || { name: algA, time: 'Unknown', space: 'Unknown' };
    const dataB = ALGORITHM_DATA[algB] || { name: algB, time: 'Unknown', space: 'Unknown' };

    const compA = eventsA[stepsA - 1]?.metrics.comparisons || 0;
    const compB = eventsB[stepsB - 1]?.metrics.comparisons || 0;
    
    const swapsA = eventsA[stepsA - 1]?.metrics.swaps || 0;
    const swapsB = eventsB[stepsB - 1]?.metrics.swaps || 0;

    const isTie = stepsA === stepsB;
    const winnerId = isTie ? 'A' : (stepsA < stepsB ? 'A' : 'B');
    const loserId = winnerId === 'A' ? 'B' : 'A';

    const winnerData = winnerId === 'A' ? dataA : dataB;
    const loserData = winnerId === 'A' ? dataB : dataA;

    const winnerCtx: AgentContext = {
        name: winnerData.name,
        track: winnerId,
        steps: winnerId === 'A' ? stepsA : stepsB,
        comp: winnerId === 'A' ? compA : compB,
        swaps: winnerId === 'A' ? swapsA : swapsB,
        time: winnerData.time,
        timeRank: rankTime(winnerData.time)
    };

    const loserCtx: AgentContext = {
        name: loserData.name,
        track: loserId,
        steps: loserId === 'A' ? stepsA : stepsB,
        comp: loserId === 'A' ? compA : compB,
        swaps: loserId === 'A' ? swapsA : swapsB,
        time: loserData.time,
        timeRank: rankTime(loserData.time)
    };

    const speedup = (loserCtx.steps / winnerCtx.steps).toFixed(1);
    const diff = loserCtx.steps - winnerCtx.steps;

    const context: RaceContext = {
        winner: winnerCtx,
        loser: loserCtx,
        isTie,
        speedup,
        diff
    };

    // Filter applicable templates
    const applicable = templates.filter(t => t.condition(context));
    
    // Fallback if none match (should mathematically never happen with this broad coverage)
    if (applicable.length === 0) {
        return [`${winnerCtx.name} finished the race in ${winnerCtx.steps} steps.`];
    }

    // Pick a random template
    const randomIndex = Math.floor(Math.random() * applicable.length);
    return applicable[randomIndex].generate(context);
}
