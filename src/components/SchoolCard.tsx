export interface School {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  schoolLevel: string;
  performance: {
    rankHistory: Array<{
      year: number;
      rank: number;
      rankOf: number;
      rankStars: number;
      rankLevel: string;
      rankStatewidePercentage: number;
      averageStandardScore: number;
    }>;
    rankMovement: number;
  };
}

export default function SchoolCard({ school }: { school: School }) {
  const currentRanking =
    school.performance.rankHistory.find(
      (rank: { year: number }) => rank.year === new Date().getFullYear()
    ) || school.performance.rankHistory[0];

  const getRankMovementDisplay = (movement: number) => {
    if (movement === 0) return { text: "No change", color: "text-gray-600" };
    if (movement > 0) return { text: `↑ ${movement}`, color: "text-green-600" };
    return { text: `↓ ${Math.abs(movement)}`, color: "text-red-600" };
  };

  const rankMovementDisplay = getRankMovementDisplay(
    school.performance.rankMovement
  );

  return (
    <div className="flex flex-col justify-between w-100 border border-gray-200 bg-white rounded-lg p-4 ">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-800 text-lg leading-tight">
          {school.name}
        </h4>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-2">
          {school.schoolLevel}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 text-sm">{school.address.street}</p>
        <p className="text-gray-600 text-sm">
          {school.address.city}, {school.address.state} {school.address.zip}
        </p>
      </div>

      {currentRanking && (
        <div className="space-y-3">
          <div className="border-t border-gray-100 pt-3">
            <h5 className="font-medium text-gray-700 text-sm mb-2">
              Performance Metrics
            </h5>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Current Rank:</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-800">
                  #{currentRanking.rank}
                </span>
                <span className="text-xs text-gray-500">
                  of {currentRanking.rankOf}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rank Change:</span>
              <span className={`font-semibold ${rankMovementDisplay.color}`}>
                {rankMovementDisplay.text}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Stars:</span>
                  <span className="ml-2 font-medium text-yellow-600">
                    {currentRanking.rankStars} ★
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Level:</span>
                  <span className="ml-2 font-medium text-gray-700">
                    {currentRanking.rankLevel}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">State %:</span>
                  <span className="ml-2 font-medium text-gray-700">
                    {currentRanking.rankStatewidePercentage.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Score:</span>
                  <span className="ml-2 font-medium text-gray-700">
                    {currentRanking.averageStandardScore.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!currentRanking && (
        <div className="border-t border-gray-100 pt-3">
          <p className="text-sm text-gray-500 italic">
            Performance data not available
          </p>
        </div>
      )}
    </div>
  );
}
