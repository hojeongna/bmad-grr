서비스·도메인 함수 작성·수정 때만 참고한다. 작은 흐름까지 쪼개지 않는다.
목적: 순서와 값의 뜻을 드러낸다.

1. 필수 검증 뒤 섞인 역할을 이름 붙은 단계로 나누고, 빈 대상은 바로 반환한다.
좋음
```python
plans = load()
todo = unchecked(plans)
if not todo:
    return
save_checks(todo)
```
나쁨
```python
plans = load()
for p in plans:
    if not checked(p):
        row = make_check(p)
        save(row)
```

2. 같은 정책은 기존 담당 함수에 두고 변경 조건을 지킨다.
좋음
```python
for row in rows:
    if row.is_color is not True:
        row.mark_attend(actor)
save_all(rows)
```
나쁨
```python
for row in rows:
    row.is_color = True
    row.updated_by = actor
```

3. 없음·빈 값·0·False의 뜻을 보존한다.
좋음
```python
if score is not None:
    subject.score = score
save(subject)
```
나쁨
```python
if score:
    subject.score = score
save(subject)
```

4. 부모 저장→ID 연결→자식 저장 순서를 드러낸다.
좋음
```python
parent = save(parent)
child.bind(parent.id)
save(child)
```
나쁨
```python
save(child)
parent = save(parent)
child.bind(parent.id)
```

5. 여럿의 조회는 모아서 하고 변환 안에 숨기지 않는다.
좋음
```python
plans = read_map(ids)
for row in rows:
    build(row, plans)
```
나쁨
```python
for row in rows:
    plan = read(row.id)
    build(row, plan)
```

예는 일부 모양이다. 인가 위치·다른 임계값·부분 수정의 뜻은 유지한다.
