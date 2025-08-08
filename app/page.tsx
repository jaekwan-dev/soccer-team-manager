"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Calendar, Users, Trophy, TrendingUp, MapPin, Clock, UserCheck, Target, BarChart3, Settings, Shield, User, Award, Menu, Star } from 'lucide-react'
import { TeamManagement } from "./components/team-management"
import { ScheduleManagement } from "./components/schedule-management"
import { TeamFormation } from "./components/team-formation"
import { AttendanceStats } from "./components/attendance-stats"
import { TeamSettings } from "./components/team-settings"

// sampleData 객체에서 경기 결과 관련 내용 제거하고 우수 출석왕으로 변경
const sampleData = {
  team: {
    name: "FC 브로",
    emblem: "/placeholder.svg?height=60&width=60",
    totalMembers: 18,
    activeMembers: 15,
    skillCategories: ["속도", "패스", "수비", "슈팅", "드리블", "체력", "멘탈"]
  },
  upcomingMatch: {
    date: "2025-08-15",
    time: "19:00",
    location: "잠실종합운동장 보조구장",
    gatherTime: "18:30",
    quarterTime: 20,
    restTime: 10,
    attendees: 12,
    total: 18
  },
  recentStats: {
    attendanceRate: 78
  },
  topAttendancePlayers: [
    { name: "김민수", position: "공격수", attendanceRate: 95, totalMatches: 20 },
    { name: "박준호", position: "미드필더", attendanceRate: 92, totalMatches: 19 },
    { name: "이동현", position: "수비수", attendanceRate: 88, totalMatches: 18 }
  ]
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isManagerMode, setIsManagerMode] = useState(true) // 총무 모드 여부
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 팀 편성 결과를 저장할 상태
  const [formedTeamA, setFormedTeamA] = useState<any[]>([])
  const [formedTeamB, setFormedTeamB] = useState<any[]>([])
  const [formedBench, setFormedBench] = useState<any[]>([])
  const [isTeamFormationComplete, setIsTeamFormationComplete] = useState(false)

  const tabItems = [
    { value: "dashboard", label: "대시보드", icon: BarChart3 },
    { value: "team", label: "팀원 관리", icon: Users },
    { value: "schedule", label: "일정 관리", icon: Calendar },
    ...(isManagerMode ? [{ value: "formation", label: "팀 편성", icon: Target }] : []),
    { value: "stats", label: "출석/통계", icon: TrendingUp },
    ...(isManagerMode ? [{ value: "settings", label: "팀 설정", icon: Settings }] : [])
  ]

  const getPositionColor = (position: string) => {
    switch (position) {
      case "골키퍼": return "bg-yellow-100 text-yellow-800"
      case "수비수": return "bg-blue-100 text-blue-800"
      case "미드필더": return "bg-green-100 text-green-800"
      case "공격수": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const calculateTeamRating = (team: any[]) => {
    if (team.length === 0) return 0
    const total = team.reduce((sum, player) => sum + player.overallRating, 0)
    return (total / team.length).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* FC 브로 엠블럼 이미지 추가 */}
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src={"/fc-bro-emblem.jpg"} alt="Team Logo" />
                <AvatarFallback>FC</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">{sampleData.team.name}</h1>
                <p className="text-sm text-gray-500">팀 관리 플랫폼</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">FC 브로</h1>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <Label htmlFor="mode-switch" className="text-sm">선수</Label>
                </div>
                <Switch
                  id="mode-switch"
                  checked={isManagerMode}
                  onCheckedChange={setIsManagerMode}
                />
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <Label htmlFor="mode-switch" className="text-sm">총무</Label>
                </div>
              </div>
              <Badge variant="outline" className={isManagerMode ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}>
                {isManagerMode ? "총무 모드" : "선수 모드"}
              </Badge>
              {isManagerMode && (
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("settings")}>
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center space-x-2">
              <Badge variant="outline" className={`text-xs ${isManagerMode ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                {isManagerMode ? "총무" : "선수"}
              </Badge>
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>메뉴</SheetTitle>
                    <SheetDescription>
                      원하는 메뉴를 선택하세요.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-6 py-4">
                    {/* Mode Switch in Mobile */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">모드 설정</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="text-sm">선수 모드</span>
                        </div>
                        <Switch
                          checked={isManagerMode}
                          onCheckedChange={setIsManagerMode}
                        />
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span className="text-sm">총무 모드</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Navigation Menu */}
                    <div className="space-y-2">
                      <h3 className="font-semibold">메뉴</h3>
                      {tabItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Button
                            key={item.value}
                            variant={activeTab === item.value ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => {
                              setActiveTab(item.value)
                              setIsMobileMenuOpen(false)
                            }}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {item.label}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Desktop Tabs */}
          <div className="hidden lg:block">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto">
              {tabItems.map((item) => {
                const Icon = item.icon
                return (
                  <TabsTrigger key={item.value} value={item.value} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden xl:inline">{item.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          {/* Mobile Tab Indicator */}
          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* 다음 경기 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5" />
                    다음 경기 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <div>경기 시간: {sampleData.upcomingMatch.date} {sampleData.upcomingMatch.time}</div>
                        <div className="text-muted-foreground">집합 시간: {sampleData.upcomingMatch.gatherTime}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span>{sampleData.upcomingMatch.location}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      쿼터 시간: {sampleData.upcomingMatch.quarterTime}분 | 휴식: {sampleData.upcomingMatch.restTime}분
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">참석 현황</span>
                    <Badge variant="secondary">
                      {sampleData.upcomingMatch.attendees}/{sampleData.upcomingMatch.total}
                    </Badge>
                  </div>
                  <Progress 
                    value={(sampleData.upcomingMatch.attendees / sampleData.upcomingMatch.total) * 100} 
                    className="mt-2" 
                  />
                  {isManagerMode && (
                    <Button className="w-full mt-4" onClick={() => setActiveTab("formation")}>
                      팀 편성하기
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* 우수 선수 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="h-5 w-5" />
                    올해 우수 출석왕
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {sampleData.topAttendancePlayers.map((player, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{player.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{player.name}</p>
                            <p className="text-xs text-muted-foreground">{player.position}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{player.attendanceRate}%</p>
                          <p className="text-xs text-muted-foreground">
                            {player.totalMatches}경기 참여
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 주요 지표 카드들 - 모바일 최적화 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 팀원</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sampleData.team.totalMembers}명</div>
                  <p className="text-xs text-muted-foreground">
                    활성 멤버 {sampleData.team.activeMembers}명
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">평균 출석률</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sampleData.recentStats.attendanceRate}%</div>
                  <Progress value={sampleData.recentStats.attendanceRate} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* 편성된 팀 표시 (대시보드) */}
            {isTeamFormationComplete && (formedTeamA.length > 0 || formedTeamB.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5" />
                    최근 편성된 팀
                  </CardTitle>
                  <CardDescription>가장 최근에 편성된 팀 정보입니다.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Team A Summary */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <h4 className="font-medium text-base">Team A ({formedTeamA.length}명)</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm font-medium">{calculateTeamRating(formedTeamA)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {formedTeamA.map((player) => (
                        <div key={player.id} className="flex items-center gap-2 text-sm">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{player.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{player.name}</span>
                          <Badge className={getPositionColor(player.mainPosition)} variant="outline" size="sm">
                            {player.mainPosition}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team B Summary */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <h4 className="font-medium text-base">Team B ({formedTeamB.length}명)</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm font-medium">{calculateTeamRating(formedTeamB)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {formedTeamB.map((player) => (
                        <div key={player.id} className="flex items-center gap-2 text-sm">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{player.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{player.name}</span>
                          <Badge className={getPositionColor(player.mainPosition)} variant="outline" size="sm">
                            {player.mainPosition}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bench Summary */}
                  {formedBench.length > 0 && (
                    <div className="md:col-span-2 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                        <h4 className="font-medium text-base">벤치 ({formedBench.length}명)</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formedBench.map((player) => (
                          <Badge key={player.id} variant="secondary" className="flex items-center gap-1">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-xs">{player.name[0]}</AvatarFallback>
                            </Avatar>
                            {player.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 최근 활동 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">최근 활동</CardTitle>
                <CardDescription>팀의 최근 활동 내역을 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3 sm:gap-4 p-3 bg-blue-50 rounded-lg">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">새로운 팀원 등록</p>
                      <p className="text-xs text-muted-foreground">정우성님이 팀에 합류했습니다</p>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0">신규</Badge>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4 p-3 bg-orange-50 rounded-lg">
                    <div className="h-2 w-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">8월 15일 자체경기 일정 등록</p>
                      <p className="text-xs text-muted-foreground">잠실종합운동장 보조구장</p>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0">일정</Badge>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4 p-3 bg-green-50 rounded-lg">
                    <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">8월 10일 연습 완료</p>
                      <p className="text-xs text-muted-foreground">기본기 향상 훈련 세션</p>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0">완료</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <TeamManagement isManagerMode={isManagerMode} />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleManagement isManagerMode={isManagerMode} />
          </TabsContent>

          {isManagerMode && (
            <TabsContent value="formation">
              <TeamFormation 
                setTeamA={setFormedTeamA}
                setTeamB={setFormedTeamB}
                setBench={setFormedBench}
                setIsFormationComplete={setIsTeamFormationComplete}
                teamA={formedTeamA}
                teamB={formedTeamB}
                bench={formedBench}
                isFormationComplete={isTeamFormationComplete}
              />
            </TabsContent>
          )}

          <TabsContent value="stats">
            <AttendanceStats isManagerMode={isManagerMode} />
          </TabsContent>

          {isManagerMode && (
            <TabsContent value="settings">
              <TeamSettings />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
