import React, { useState, useEffect } from "react";
import { Trophy, Users, Plus, Clock, Award, Crown } from "lucide-react";

const LeaderboardApp = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastClaimResult, setLastClaimResult] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [pointsHistory, setPointsHistory] = useState([]);

  // API base URL
  const API_BASE = "http://localhost:5000/api";

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/users`);
      const data = await response.json();
      setUsers(data);
      if (data.length > 0 && !selectedUserId) {
        setSelectedUserId(data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch points history
  const fetchPointsHistory = async () => {
    try {
      const response = await fetch(`${API_BASE}/points-history`);
      const data = await response.json();
      setPointsHistory(data.slice(0, 10)); // Show last 10 records
    } catch (error) {
      console.error("Error fetching points history:", error);
    }
  };

  // Add new user
  const addUser = async () => {
    if (!newUserName.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newUserName.trim() }),
      });

      if (response.ok) {
        setNewUserName("");
        setShowAddUser(false);
        await fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user");
    } finally {
      setIsLoading(false);
    }
  };

  // Claim points
  const claimPoints = async () => {
    if (!selectedUserId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/claim-points`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: selectedUserId }),
      });

      const result = await response.json();
      if (response.ok) {
        setLastClaimResult(result);
        await fetchUsers();
        await fetchPointsHistory();

        // Clear the result after 3 seconds
        setTimeout(() => setLastClaimResult(null), 3000);
      } else {
        alert(result.error || "Failed to claim points");
      }
    } catch (error) {
      console.error("Error claiming points:", error);
      alert("Failed to claim points");
    } finally {
      setIsLoading(false);
    }
  };

  // Get rank color
  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  // Get rank icon
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Award className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">
            {rank}
          </span>
        );
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPointsHistory();
  }, []);

  const selectedUser = users.find((user) => user._id === selectedUserId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-500" />
            Leaderboard System
          </h1>
          <p className="text-gray-600">Claim points and climb the rankings!</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - User Selection and Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Select User
              </h2>

              {/* User Selection */}
              <div className="mb-4">
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                >
                  <option value="">Select a user...</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.totalPoints} points)
                    </option>
                  ))}
                </select>
              </div>

              {/* Claim Button */}
              <button
                onClick={claimPoints}
                disabled={!selectedUserId || isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? "Claiming..." : "Claim Points"}
              </button>

              {/* Last Claim Result */}
              {lastClaimResult && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-semibold">
                    🎉 {lastClaimResult.user.name} gained{" "}
                    {lastClaimResult.pointsAwarded} points!
                  </p>
                  <p className="text-green-600 text-sm">
                    Total: {lastClaimResult.newTotalPoints} points
                  </p>
                </div>
              )}
            </div>

            {/* Add User Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New User
              </h3>

              {!showAddUser ? (
                <button
                  onClick={() => setShowAddUser(true)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Add User
                </button>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter user name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === "Enter" && addUser()}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addUser}
                      disabled={!newUserName.trim() || isLoading}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg disabled:opacity-50 transition-colors duration-200"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddUser(false);
                        setNewUserName("");
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Leaderboard
              </h2>

              {/* Top 3 Users */}
              {users.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[1, 0, 2].map((index) => {
                    const user = users[index];
                    const position = index === 0 ? 1 : index === 1 ? 2 : 3;
                    return (
                      <div
                        key={user._id}
                        className={`text-center ${
                          position === 1
                            ? "order-2"
                            : position === 2
                            ? "order-1"
                            : "order-3"
                        }`}
                      >
                        <div
                          className={`relative ${
                            position === 1 ? "scale-110" : ""
                          }`}
                        >
                          <div
                            className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${
                              position === 1
                                ? "from-yellow-400 to-yellow-600"
                                : position === 2
                                ? "from-gray-300 to-gray-500"
                                : "from-amber-400 to-amber-600"
                            } flex items-center justify-center text-white font-bold text-xl mb-2`}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="absolute -top-2 -right-2">
                            {getRankIcon(position)}
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-800">
                          {user.name}
                        </h3>
                        <p className="text-lg font-bold text-blue-600">
                          {user.totalPoints}
                        </p>
                        <p className="text-sm text-gray-500">points</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Full Leaderboard */}
              <div className="space-y-2">
                {users.map((user, index) => (
                  <div
                    key={user._id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors duration-200 ${
                      user._id === selectedUserId
                        ? "bg-blue-50 border-2 border-blue-200"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10">
                        {getRankIcon(user.rank)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Rank #{user.rank}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">
                        {user.totalPoints}
                      </p>
                      <p className="text-sm text-gray-500">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            {pointsHistory.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </h3>
                <div className="space-y-2">
                  {pointsHistory.map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {record.userName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(record.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          +{record.pointsAwarded}
                        </p>
                        <p className="text-sm text-gray-500">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardApp;
