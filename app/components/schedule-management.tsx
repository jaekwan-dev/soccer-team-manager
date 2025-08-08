"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, MapPin, Users, Plus, Check, X, AlertCircle, Timer, Coffee } from 'lucide-react'

// 경기 유형을 자체경기/A매치/연습으로 변경하고 샘플 데이터 업데이트
const schedules = [
  {
    id: 1,
    title: "정기 자체경기",
    date: "2025-08-15",
    time: "19:00",
    gatherTime: "18:30",
    location: "잠실종합운동장 보조구장",
    quarterTime: 20,
    restTime: 10,
    type: "internal", // 자체경기
    status: "upcoming",
    attendees: [
      { name: "김민수", status: "attending", position: "공격수", rating: 7.6 },
      { name: "박준호", status: "attending", position: "미드필더", rating: 7.7 },
      { name: "이동현", status: "attending", position: "수비수", rating: 7.0 },
      { name: "최우진", status: "pending", position: "골키퍼", rating: 6.1 },
      { name: "정우성", status: "not_attending", position: "공격수", rating: 7.2 }
    ],
    description: "월례 정기 자체경기입니다. 집합 시간을 꼭 지켜주세요!"
  },
  {
    id: 2,
    title: "vs FC 라이트닝 A매치",
    date: "2025-08-20",
    time: "18:00",
    gatherTime: "17:30",
    location: "한강공원 축구장",
    quarterTime: 25,
    restTime: 10,
    type: "match", // A매치
    status: "upcoming",
    attendees: [
      { name: "김민수", status: "attending", position: "공격수", rating: 7.6 },
      { name: "박준호", status: "attending", position: "미드필더", rating: 7.7 },
      { name: "이동현", status: "pending", position: "수비수", rating: 7.0 },
      { name: "최우진", status: "attending", position: "골키퍼", rating: 6.1 }
    ],
    description: "FC 라이트닝과의 친선 경기입니다."
  },
  {
    id: 3,
    title: "팀 연습",
    date: "2025-08-12",
    time: "20:00",
    gatherTime: "19:45",
    location: "올림픽공원 축구장",
    quarterTime: 30,
    restTime: 15,
    type: "training", // 연습
    status: "upcoming",
    attendees: [
      { name: "김민수", status: "attending", position: "공격수", rating: 7.6 },
      { name: "박준호", status: "attending", position: "미드필더", rating: 7.7 },
      { name: "이동현", status: "pending", position: "수비수", rating: 7.0 },
      { name: "최우진", status: "attending", position: "골키퍼", rating: 6.1 }
    ],
    description: "기본기 향상을 위한 훈련 세션입니다."
  }
]

interface ScheduleManagementProps {
  isManagerMode: boolean
}

export function ScheduleManagement({ isManagerMode }: ScheduleManagementProps) {
  const [isAddingSchedule, setIsAddingSchedule] = useState(false)
  const [newSchedule, setNewSchedule] = useState({
    title: "",
    type: "internal", // 기본값을 자체경기로 변경
    date: "",
    time: "",
    gatherTime: "",
    location: "",
    quarterTime: 20,
    restTime: 10,
    description: ""
  })

  // getTypeColor 함수 업데이트
  const getTypeColor = (type: string) => {
    switch (type) {
      case "internal": return "bg-green-100 text-green-800" // 자체경기
      case "match": return "bg-red-100 text-red-800" // A매치
      case "training": return "bg-blue-100 text-blue-800" // 연습
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-yellow-100 text-yellow-800"
      case "completed": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getAttendanceStats = (attendees: any[]) => {
    const attending = attendees.filter(a => a.status === "attending" || a.status === "attended").length
    const total = attendees.length
    return { attending, total, percentage: Math.round((attending / total) * 100) }
  }

  const getPositionColor = (position: string) => {
    switch (position) {
      case "골키퍼": return "bg-yellow-100 text-yellow-800"
      case "수비수": return "bg-blue-100 text-blue-800"
      case "미드필더": return "bg-green-100 text-green-800"
      case "공격수": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">일정 관리</h2>
          <p className="text-muted-foreground hidden md:block">
            {isManagerMode ? "팀원 정보를 관리하고 평가하세요" : "팀원 정보를 확인하세요"}
          </p>
        </div>
        {isManagerMode && (
          <Dialog open={isAddingSchedule} onOpenChange={setIsAddingSchedule}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                일정 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>새 일정 추가</DialogTitle>
                <DialogDescription>새로운 팀 일정을 등록하세요</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">제목 *</Label>
                    <Input 
                      id="title" 
                      value={newSchedule.title}
                      onChange={(e) => setNewSchedule({...newSchedule, title: e.target.value})}
                      placeholder="일정 제목을 입력하세요" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">유형 *</Label>
                    {/* 일정 유형 선택 옵션 변경 */}
                    <Select 
                      value={newSchedule.type} 
                      onValueChange={(value) => setNewSchedule({...newSchedule, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">자체경기</SelectItem>
                        <SelectItem value="match">A매치</SelectItem>
                        <SelectItem value="training">연습</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">날짜 *</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={newSchedule.date}
                      onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">시작 시간 *</Label>
                    <Input 
                      id="time" 
                      type="time" 
                      value={newSchedule.time}
                      onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gatherTime">집합 시간</Label>
                    <Input 
                      id="gatherTime" 
                      type="time" 
                      value={newSchedule.gatherTime}
                      onChange={(e) => setNewSchedule({...newSchedule, gatherTime: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">장소 *</Label>
                  <Input 
                    id="location" 
                    value={newSchedule.location}
                    onChange={(e) => setNewSchedule({...newSchedule, location: e.target.value})}
                    placeholder="경기/훈련 장소를 입력하세요" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quarterTime">쿼터 시간 (분)</Label>
                    <Input 
                      id="quarterTime" 
                      type="number" 
                      value={newSchedule.quarterTime}
                      onChange={(e) => setNewSchedule({...newSchedule, quarterTime: parseInt(e.target.value) || 20})}
                      min="10"
                      max="45"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="restTime">휴식 시간 (분)</Label>
                    <Input 
                      id="restTime" 
                      type="number" 
                      value={newSchedule.restTime}
                      onChange={(e) => setNewSchedule({...newSchedule, restTime: parseInt(e.target.value) || 10})}
                      min="5"
                      max="20"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea 
                    id="description" 
                    value={newSchedule.description}
                    onChange={(e) => setNewSchedule({...newSchedule, description: e.target.value})}
                    placeholder="추가 정보를 입력하세요" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingSchedule(false)}>
                  취소
                </Button>
                <Button 
                  onClick={() => setIsAddingSchedule(false)}
                  disabled={!newSchedule.title || !newSchedule.date || !newSchedule.time || !newSchedule.location}
                >
                  등록
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* 일정 목록 */}
      <div className="space-y-4">
        {schedules.map((schedule) => {
          const stats = getAttendanceStats(schedule.attendees)
          
          return (
            <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base sm:text-lg leading-tight">{schedule.title}</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 flex-shrink-0">
                      <Badge className={getTypeColor(schedule.type)} variant="secondary">
                        {schedule.type === "internal" ? "자체경기" : schedule.type === "match" ? "A매치" : "연습"}
                      </Badge>
                      <Badge className={getStatusColor(schedule.status)} variant="outline">
                        {schedule.status === "upcoming" ? "예정" : "완료"}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* 모바일에서는 세로 스택, 데스크톱에서는 그리드 */}
                  <div className="space-y-2 sm:space-y-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span>{schedule.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span>시작: {schedule.time}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span>집합: {schedule.gatherTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{schedule.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{schedule.description}</p>
                
                {/* 참석 현황 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">참석 현황</span>
                    </div>
                    <Badge variant="secondary">
                      {stats.attending}/{stats.total} ({stats.percentage}%)
                    </Badge>
                  </div>
                  <Progress value={stats.percentage} className="h-2" />
                  
                  {/* 참석자 목록 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {schedule.attendees.map((attendee, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          <AvatarFallback className="text-xs">{attendee.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-sm truncate">{attendee.name}</span>
                          <Badge className={getPositionColor(attendee.position)} variant="outline" size="sm">
                            {attendee.position}
                          </Badge>
                          {isManagerMode && (
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {attendee.rating}
                            </span>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          {attendee.status === "attending" || attendee.status === "attended" ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : attendee.status === "not_attending" ? (
                            <X className="h-3 w-3 text-red-500" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 자체경기일 때만 팀 편성 버튼 표시 */}
                {schedule.status === "upcoming" && isManagerMode && schedule.type === "internal" && (
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button size="sm" className="w-full sm:w-auto">참석 투표 보기</Button>
                    {/* "팀 편성하기" 버튼 제거 */}
                  </div>
                )}
                {schedule.status === "upcoming" && !isManagerMode && (
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button size="sm" className="w-full sm:w-auto">참석 여부 선택</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
