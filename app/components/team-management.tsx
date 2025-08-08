"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { UserPlus, Edit, Star, MapPin, Phone, Mail, Calendar, TrendingUp, Plus, X, Eye, EyeOff } from 'lucide-react'

// 팀 설정에서 가져온 능력치와 포지션 (실제로는 전역 상태나 props로 관리)
const teamSkillCategories = ["속도", "패스", "수비", "슈팅", "드리블", "체력", "멘탈"]
const teamPositions = {
  "골키퍼": ["GK"],
  "수비수": ["CB", "LB", "RB", "SW"],
  "미드필더": ["CDM", "CM", "CAM", "LM", "RM"],
  "공격수": ["CF", "LW", "RW", "ST"]
}

// 샘플 팀원 데이터 (종합 점수 포함)
const teamMembers = [
  {
    id: 1,
    name: "김민수",
    mainPosition: "공격수",
    subPositions: ["CF", "LW", "RW"],
    skills: { "속도": 9, "패스": 7, "수비": 5, "슈팅": 9, "드리블": 8, "체력": 8, "멘탈": 7 },
    overallRating: 7.6,
    phone: "010-1234-5678",
    email: "minsu@example.com",
    joinDate: "2024-03-15",
    attendanceRate: 85,
    goals: 12,
    assists: 5
  },
  {
    id: 2,
    name: "박준호",
    mainPosition: "미드필더",
    subPositions: ["CM", "CAM", "CDM"],
    skills: { "속도": 7, "패스": 9, "수비": 7, "슈팅": 6, "드리블": 8, "체력": 9, "멘탈": 8 },
    overallRating: 7.7,
    phone: "010-2345-6789",
    email: "junho@example.com",
    joinDate: "2024-01-20",
    attendanceRate: 92,
    goals: 3,
    assists: 8
  },
  {
    id: 3,
    name: "이동현",
    mainPosition: "수비수",
    subPositions: ["CB", "RB", "LB"],
    skills: { "속도": 6, "패스": 7, "수비": 9, "슈팅": 4, "드리블": 6, "체력": 8, "멘탈": 9 },
    overallRating: 7.0,
    phone: "010-3456-7890",
    email: "donghyun@example.com",
    joinDate: "2023-11-10",
    attendanceRate: 88,
    goals: 1,
    assists: 2
  },
  {
    id: 4,
    name: "최우진",
    mainPosition: "골키퍼",
    subPositions: ["GK"],
    skills: { "속도": 5, "패스": 6, "수비": 9, "슈팅": 3, "드리블": 5, "체력": 7, "멘탈": 8 },
    overallRating: 6.1,
    phone: "010-4567-8901",
    email: "woojin@example.com",
    joinDate: "2024-02-05",
    attendanceRate: 90,
    goals: 0,
    assists: 0
  }
]

interface TeamManagementProps {
  isManagerMode: boolean
}

export function TeamManagement({ isManagerMode }: TeamManagementProps) {
  const [selectedMember, setSelectedMember] = useState(null)
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    mainPosition: "",
    subPositions: [],
    skills: {},
    phone: "",
    email: ""
  })

  const getPositionColor = (position: string) => {
    switch (position) {
      case "골키퍼": return "bg-yellow-100 text-yellow-800"
      case "수비수": return "bg-blue-100 text-blue-800"
      case "미드필더": return "bg-green-100 text-green-800"
      case "공격수": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const calculateOverallRating = (skills: any) => {
    const values = Object.values(skills).filter(v => typeof v === 'number') as number[]
    if (values.length === 0) return 0
    return Number((values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1))
  }

  const addSubPosition = (position: string) => {
    if (!newMemberData.subPositions.includes(position)) {
      setNewMemberData({
        ...newMemberData,
        subPositions: [...newMemberData.subPositions, position]
      })
    }
  }

  const removeSubPosition = (position: string) => {
    setNewMemberData({
      ...newMemberData,
      subPositions: newMemberData.subPositions.filter(p => p !== position)
    })
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">팀원 관리</h2>
          <p className="text-muted-foreground hidden md:block">
            {isManagerMode ? "팀원 정보를 관리하고 평가하세요" : "팀원 정보를 확인하세요"}
          </p>
        </div>
        {isManagerMode && (
          <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                팀원 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>새 팀원 추가</DialogTitle>
                <DialogDescription>새로운 팀원의 정보를 입력하세요</DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">기본 정보</TabsTrigger>
                  <TabsTrigger value="position">포지션</TabsTrigger>
                  <TabsTrigger value="skills">능력치</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">이름 *</Label>
                      <Input 
                        id="name" 
                        value={newMemberData.name}
                        onChange={(e) => setNewMemberData({...newMemberData, name: e.target.value})}
                        placeholder="이름을 입력하세요" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">연락처</Label>
                      <Input 
                        id="phone" 
                        value={newMemberData.phone}
                        onChange={(e) => setNewMemberData({...newMemberData, phone: e.target.value})}
                        placeholder="010-0000-0000" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={newMemberData.email}
                      onChange={(e) => setNewMemberData({...newMemberData, email: e.target.value})}
                      placeholder="email@example.com" 
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="position" className="space-y-4">
                  <div className="space-y-2">
                    <Label>주 포지션 (대분류) *</Label>
                    <Select 
                      value={newMemberData.mainPosition} 
                      onValueChange={(value) => setNewMemberData({...newMemberData, mainPosition: value, subPositions: []})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="주 포지션을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(teamPositions).map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {newMemberData.mainPosition && (
                    <div className="space-y-3">
                      <Label>세부 포지션 (선택사항)</Label>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {teamPositions[newMemberData.mainPosition]?.map((pos) => (
                            <Button
                              key={pos}
                              variant={newMemberData.subPositions.includes(pos) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                if (newMemberData.subPositions.includes(pos)) {
                                  removeSubPosition(pos)
                                } else {
                                  addSubPosition(pos)
                                }
                              }}
                            >
                              {pos}
                            </Button>
                          ))}
                        </div>
                        {newMemberData.subPositions.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm">선택된 세부 포지션:</Label>
                            <div className="flex flex-wrap gap-1">
                              {newMemberData.subPositions.map((pos) => (
                                <Badge key={pos} variant="secondary" className="flex items-center gap-1">
                                  {pos}
                                  <button onClick={() => removeSubPosition(pos)}>
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="skills" className="space-y-4">
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      각 능력치를 1-10점으로 평가하세요. 모든 항목의 평균이 종합 점수가 됩니다.
                    </div>
                    {teamSkillCategories.map((skill) => (
                      <div key={skill} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>{skill}</Label>
                          <span className="text-sm font-medium">
                            {newMemberData.skills[skill] || 5}/10
                          </span>
                        </div>
                        <Slider
                          value={[newMemberData.skills[skill] || 5]}
                          onValueChange={(value) => setNewMemberData({
                            ...newMemberData,
                            skills: { ...newMemberData.skills, [skill]: value[0] }
                          })}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    ))}
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">종합 점수</span>
                        <span className="text-lg font-bold text-blue-600">
                          {calculateOverallRating(newMemberData.skills)}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddingMember(false)}>
                  취소
                </Button>
                <Button 
                  onClick={() => setIsAddingMember(false)}
                  disabled={!newMemberData.name || !newMemberData.mainPosition}
                >
                  추가
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* 팀원 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg truncate">{member.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge className={getPositionColor(member.mainPosition)} variant="secondary">
                        {member.mainPosition}
                      </Badge>
                      {isManagerMode && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{member.overallRating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      {isManagerMode ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{member.name} 상세 정보</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="info" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="info">기본 정보</TabsTrigger>
                        <TabsTrigger value="position">포지션</TabsTrigger>
                        {isManagerMode && <TabsTrigger value="skills">능력치</TabsTrigger>}
                        <TabsTrigger value="stats">통계</TabsTrigger>
                      </TabsList>
                      <TabsContent value="info" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>이름</Label>
                            <Input defaultValue={member.name} disabled={!isManagerMode} />
                          </div>
                          <div className="space-y-2">
                            <Label>연락처</Label>
                            <Input defaultValue={member.phone} disabled={!isManagerMode} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>이메일</Label>
                          <Input defaultValue={member.email} disabled={!isManagerMode} />
                        </div>
                      </TabsContent>
                      <TabsContent value="position" className="space-y-4">
                        <div className="space-y-2">
                          <Label>주 포지션 (대분류)</Label>
                          {isManagerMode ? (
                            <Select defaultValue={member.mainPosition}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.keys(teamPositions).map((pos) => (
                                  <SelectItem key={pos} value={pos}>
                                    {pos}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="p-2 bg-gray-50 rounded-md">
                              <Badge className={getPositionColor(member.mainPosition)}>
                                {member.mainPosition}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>세부 포지션</Label>
                          <div className="flex flex-wrap gap-2">
                            {member.subPositions.map((pos) => (
                              <Badge key={pos} variant="outline">{pos}</Badge>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      {isManagerMode && (
                        <TabsContent value="skills" className="space-y-4">
                          <div className="space-y-4">
                            {Object.entries(member.skills).map(([skill, value]) => (
                              <div key={skill} className="space-y-2">
                                <div className="flex justify-between">
                                  <Label>{skill}</Label>
                                  <span className="text-sm font-medium">{value}/10</span>
                                </div>
                                <Progress value={value * 10} className="h-2" />
                              </div>
                            ))}
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">종합 점수</span>
                                <span className="text-lg font-bold text-blue-600">
                                  {member.overallRating}/10
                                </span>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      )}
                      <TabsContent value="stats" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">출석률</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">{member.attendanceRate}%</div>
                              <Progress value={member.attendanceRate} className="mt-2" />
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">골/어시스트</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">{member.goals}G / {member.assists}A</div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>세부 포지션:</span>
                  <div className="flex flex-wrap gap-1">
                    {member.subPositions.slice(0, 2).map((pos) => (
                      <Badge key={pos} variant="outline" className="text-xs">{pos}</Badge>
                    ))}
                    {member.subPositions.length > 2 && (
                      <Badge variant="outline" className="text-xs">+{member.subPositions.length - 2}</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>가입일: {member.joinDate}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground">출석률</span>
                <span className="text-sm font-medium">{member.attendanceRate}%</span>
              </div>
              <Progress value={member.attendanceRate} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
