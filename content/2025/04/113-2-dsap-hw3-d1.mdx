---
title: "113-2 DSAP Hw3 D1"
date: Sun Apr 13 2025 08:00:00 GMT+0800 (Taiwan Standard Time)
tags:
  - "tech-memo"
categories:
  - "tech-notes"
coverImage: "https://img.waynspace.com/2025/04/113-2-dsap-hw3-d1/image2.webp"
slug: "113-2-dsap-hw3-d1"
---


HackMD好讀版點[這裡](https://hackmd.io/@wKP0ZgCnRna67MvvepBYLQ/Waynting)

### 總結與回顧

This is my first time documenting the process of solving a homework problem.  
The main reason I started this project is to push myself to complete coding exercises more thoroughly—without relying on AI assistance.  
Although I wouldn't call it a full success, this attempt has brought some positive changes: I’ve reduced my dependency on AI and started practicing how to express my thoughts and logic clearly.  
This article may be a bit messy and casual, but to me, it's a big step toward facing my weaknesses and actively making a change.  
I'll do my best to continue writing tech notes like this. One step at a time.

這是我第一次紀錄自己解題的過程。  
我之所以想開始這個計畫，是為了督促自己更扎實地完成程式練習，而且不依賴 AI 協助。  
雖然這次的嘗試稱不上完全成功，但它確實帶來了一些正面的改變：我開始減少對 AI 的依賴，也開始練習如何清楚地表達自己的思考與邏輯。  
這篇文章也許有點零碎、風格偏隨性，但對我來說，這是一個重要的起點，是我面對自己弱點、試著改變的一小步。  
我會繼續努力寫出更多像這樣的技術筆記！

* * *

## 題目敘述

工程師小金想比較不同的資料結構實作佇列 (Queue) 會有什麼差異，所以想請你幫忙實作具有 IQueue 介面的兩種不同的類別 LinkedQueue 與 ArrayQueue。請注意佇列是一種先入先出 (FIFO) 的資料集合，先加入 (Enqueue) 到佇列的元素會先從佇列被移除 (Dequeue)：

**實作 LinkedQueue 的建構子、複製建構子、賦值運算、解構子**

```
LinkedQueue();
LinkedQueue(const LinkedQueue&);
LinkedQueue& operator=(const LinkedQueue&);
~LinkedQueue();
```

**實作 ArrayQueue 的建構子（不用實作複製建構子、賦值運算、解構子）**

```
ArrayQueue();
```

**實作 Empty 方法，回傳佇列是否為空**

```
virtual bool Empty() const = 0;
```

**實作 Enqueue 方法，將元素 val 插入到佇列中**

- 佇列是一種先入先出 (FIFO) 的資料集合，先加入 (Enqueue) 到佇列的元素會先從佇列被移除 (Dequeue)：

```
virtual void Enqueue(const T&) = 0;
```

**實作 Dequeue 方法，將一個元素從佇列移除**

- 佇列是一種先入先出 (FIFO) 的資料集合，先加入 (Enqueue) 到佇列的元素會先從佇列被移除 (Dequeue)：

- 當佇列為空時，為《未定義行為》

```
virtual T Dequeue() = 0;
```

**實作 Peek 方法，回傳下一個會被移除的元素值**

- 當佇列為空時，為《未定義行為》

```
virtual const T& Peek() const = 0;
```

**注意:** T 不一定為 `int`，T 型態只保證提供預設建構與複製語意

* * *

### 題目給予的內容

```
#include <iostream>
#include <utility>
#include <vector>
#include <cassert>    // For Test
#include <random>     // For Test
#include <functional> // For Test

template<typename T>
struct IQueue {
    virtual ~IQueue() {}
    virtual bool Empty() const = 0;
    virtual void Enqueue(const T&) = 0;
    virtual T Dequeue() = 0;
    virtual const T& Peek() const = 0;
};

template<typename T>
struct ListNode {
    ListNode(T val) : val{std::move(val)}, next{nullptr} {}
    T val;
    ListNode* next;
};

template<typename T>
class LinkedQueue: public IQueue<T> {
    public:
        using ElemType = T;
        LinkedQueue();
        LinkedQueue(const LinkedQueue&);
        LinkedQueue& operator=(const LinkedQueue&);
        ~LinkedQueue();
        bool Empty() const;
        void Enqueue(const T&);
        T Dequeue();
        const T& Peek() const;
    private:
        ListNode<T>* node_;
};

template<typename T>
class ArrayQueue : public IQueue<T> {
    public:
        using ElemType = T;
        ArrayQueue();
        bool Empty() const;
        void Enqueue(const T&);
        T Dequeue();
        const T& Peek() const;
    private:
        std::vector<T> data_;
        int a_;
        int b_;
};

template<typename TQueue,
         typename = std::enable_if<
            std::is_base_of<
                IQueue<typename TQueue::ElemType>, TQueue>::value>>
std::ostream& operator<<(std::ostream& os, const TQueue& p) {
    TQueue q = p;
    bool isFirst = true;
    os << '[';
    while (!q.Empty()) {
        if (isFirst) {
            isFirst = false;
        } else {
            os << ", ";
        }
        os << q.Dequeue();
    }
    os << ']';
    return os;
}

void Test1(); // Sample1
void Test2(); // LinkedQueue
void Test3(); // LinkedQueue [Large Element]
void Test4(); // ArrayQueue
void Test5(); // ArrayQueue [Large Element]
void Test6(); // ArrayQueue and LinkedQueue

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int id;
    std::cin >> id;
    void (*f[])() = { Test1, Test2, Test3, Test4, Test5, Test6 };
    f[id-1]();
}

void Test1() {
    LinkedQueue<int> q1;
    std::cout << "01) " << q1 << std::endl;

    q1.Enqueue(3);
    std::cout << "02) " << q1 << std::endl;

    q1.Enqueue(5);
    std::cout << "03) " << q1 << std::endl;

    q1.Enqueue(7);
    std::cout << "04) " << q1 << std::endl;

    std::cout << "05) " << q1.Dequeue() << std::endl;

    std::cout << "06) " << q1.Peek() << std::endl;

    q1.Enqueue(9);
    std::cout << "07) " << q1 << std::endl;

    ArrayQueue<int> q2;
    std::cout << "08) " << q2 << std::endl;

    q2.Enqueue(3);
    std::cout << "09) " << q2 << std::endl;

    q2.Enqueue(5);
    std::cout << "10) " << q2 << std::endl;

    q2.Enqueue(7);
    std::cout << "11) " << q2 << std::endl;

    std::cout << "12) " << q2.Dequeue() << std::endl;

    std::cout << "13) " << q2.Peek() << std::endl;

    q2.Enqueue(9);
    std::cout << "14) " << q2 << std::endl;
}

namespace Feis {
}

void Test2() {
}
void Test3() {
}
void Test4() {
}
void Test5() {
}
void Test6() {
}

// [YOUR CODE WILL BE PLACED HERE]
```

* * *

# 實作紀錄

（以下有些雜亂但應該有些幫助）

# First Attempt

2025/4/9下午2.~3.：

一開始忘記怎麼用Single Linked，找回記憶後就好了。

array的部分則沒太多問題，昨天上課有提到如何利用兩個位置標示a\_、b\_來表示陣列的前後，在實作的時候記得要根據動作調整這二者的位置即可。（到後面發現根本好像不是這樣用）

![](https://img.waynspace.com/2025/04/113-2-dsap-hw3-d1/image.webp)

不過大概卡了十分鐘在q1.Enquene不知道為甚麼只能跑到 2) ，後來發現是我根本沒寫好 copy constructor，根本就在shallow copy（淺複製，意指只有複製指向開頭的指標）。改成Deep Copy（深複製，也就是完整的複製整組串列的內容）就解決了。

### Deep Copy 實作（非 Circular）

```
//幫你貼心的把Struct放在這
/*
struct ListNode {
    ListNode(T val) : val{std::move(val)}, next{nullptr} {}
    T val;
    ListNode* next;
};
*/

// Deep Copy Implement
template<typename T>
LinkedQueue<T>::LinkedQueue(const LinkedQueue& other) {
    if (other.node_ == nullptr) {
        node_ = nullptr;
    } else {
        // 建立新的第一個節點
        node_ = new ListNode<T>(other.node_->val);
        ListNode<T>* currentSrc = other.node_->next;
        ListNode<T>* currentDst = node_;
        while (currentSrc != nullptr) { //接著不斷移動複製直到尾
            currentDst->next = new ListNode<T>(currentSrc->val);
            currentDst = currentDst->next;
            currentSrc = currentSrc->next;
        }
    }
}

//這個時候還沒改成 circular linked quene
```

### Outcome

First Attempt: TLE(in 2 4 5 6) get 8 point.

# Second Attempt

> D1 原本 2 TLE, 56 MLE，把 node\_ 改成 tail，然後讓它指向 head 解決 TEL，但因為有循環實作上要小心一點（destructor 要先斷開循環），另外是當 a\_超過 vector 大小的一半（vector 前半的東西都已經 dequeue 掉了）就把前面的東西清掉，解決 MLE

討論區上的推薦修正方向，感謝我的強大同學們。

## LinkedQuene

> 將原本從頭開始的LinkedQuene，改成 Circular 的方式。  
> 也就是將 node\_ 指向Tail，並將 Tail 的 next 指向Head。

![](https://img.waynspace.com/2025/04/113-2-dsap-hw3-d1/image2.webp)

## **Copy Constructor** 和 **Destructor**

前者（Copy Constructor）的重點是「取得原始列的Head」：

1. 取得原始列的Head

3. 繼續向後複製直到 Tail （直到發現 → next = head\_）

5. 把 _newTail->next = newHead_，再將原本的 _node\_ = newTail_

後者（Destructor）的重點是「如何拆開循環」：

1. 取得第一個元素位置

3. 把尾端指向Nullptr

5. 接著從頭開始刪除

### Copy constructor 實作

```
//幫你貼心的把Struct放在這
/*
struct ListNode {
    ListNode(T val) : val{std::move(val)}, next{nullptr} {}
    T val;
    ListNode* next;
};
*/

// Copy constructor：複製另一個 circular linked list
template<typename T>
LinkedQueue<T>::LinkedQueue(const LinkedQueue& other) {
    if (other.node_ == nullptr) {
        node_ = nullptr;
    } else {
        // 取得原始隊列的 head (tail->next)
        ListNode<T>* origHead = other.node_->next;
        // 建立新鏈結的第一個節點 (newHead)
        ListNode<T>* newHead = new ListNode<T>(origHead->val);
        ListNode<T>* newTail = newHead;

        // 從原始 head 的下一個開始複製，直到回到 origHead
        for (ListNode<T>* current = origHead->next; current != origHead; current = current->next) {
            newTail->next = new ListNode<T>(current->val);
            newTail = newTail->next;
        }
        // 完成 circular 連結：newTail->next 指向 newHead
        newTail->next = newHead;
        // 將本物件的 tail 設為 newTail
        node_ = newTail;
    }
}
```

### Destructor 實作

```
//新的Destructor
template<typename T>
LinkedQueue<T>::~LinkedQueue() {
    if (node_ != nullptr) {
        // 取得 head（佇列第一個元素）
        ListNode<T>* head = node_->next;
        // 斷開環狀連結，讓 tail->next = nullptr
        node_->next = nullptr;
        // 依序刪除所有節點
        while (head != nullptr) {
            ListNode<T>* temp = head;
            head = head->next;
            delete temp;
        }
    }
}
```

（看到這個註解有GPT的味，沒錯你想的是對的）

## Enquene & Dequene

這兩個這我認為較為單純。

前者（Enquene）

1. val 創建一個新的 newnode\_

3. 將 newnode\_→next 指向 head（也就是目前node\_（Tail）→ next），

5. node\_->next = newnode

7. node\_ = newnode

後者（Dequene）

1. 利用 tail\_ → next取得 head\_ 並存起來

3. tail\_→ next = head\_ → next

5. delete head\_ 並回傳值

### Enqueue 實作

```
//幫你貼心的把Struct放在這
/*
struct ListNode {
    ListNode(T val) : val{std::move(val)}, next{nullptr} {}
    T val;
    ListNode* next;
};
*/
// Enqueue：在 circular list 中插入新節點
template<typename T>
void LinkedQueue<T>::Enqueue(const T& val) {
    // 空隊列情形：建立一個新節點，讓其 next 指向自己
    if (node_ == nullptr) {
        node_ = new ListNode<T>(val);
        node_->next = node_;
        return;
    }
    // 非空：建立新節點，令新節點->next 指向原 head (即 node_->next)
    ListNode<T>* newNode = new ListNode<T>(val);
    newNode->next = node_->next;
    node_->next = newNode;
    // 更新 tail：newNode 成為新的 tail
    node_ = newNode;
}
```

### Dequeue 實作

```
// Dequeue：取出 head 元素
template<typename T>
T LinkedQueue<T>::Dequeue() {
    assert(node_ != nullptr && "Dequeue called on empty queue.");
    // head 為 tail->next
    ListNode<T>* head = node_->next;
    T ans = head->val;
    // 若只有一個元素，刪除後設為空
    if (node_ == head) {
        delete head;
        node_ = nullptr;
    } else {
        node_->next = head->next;
        delete head;
    }
    return ans;
}
```

Reference: [https://hackmd.io/@hank20010209/B1TkvWYO\_](https://hackmd.io/@hank20010209/B1TkvWYO_)

## ArrayQuene

```
std::vector<T> data_; //存資料
int a_; //存開頭的位置
int b_; //陣列最大容量
```

原本那個方法不是不行，但會TLE（Time Limit Exceed），所以改了新方法

此部分則是比較單純，幾個原則：

1. 如果目前元素數量 > 陣列最大容量：將容量翻倍，並將原本的內容搬遷過去

3. 一樣用 a\_ 指向第一個元素（Head\_）

```
//幫你貼心的把Struct放在這
/*
std::vector<T> data_;
int a_;
int b_;
*/

template<typename T>
void ArrayQueue<T>::Enqueue(const T& val) {
    // 當陣列已滿，進行擴充（通常以容量翻倍）
    if (b_ == data_.size()) {
        std::vector<T> newData(data_.size() * 2);
        // 按照正確的順序搬移現有元素
        for (size_t i = 0; i < b_; i++) {
            newData[i] = data_[(a_ + i) % data_.size()];
        }
        data_ = std::move(newData);
        a_ = 0;
    }
    // 新元素插入的位置：(head_ + count_) mod capacity
    size_t tail = (a_ + b_) % data_.size();
    data_[tail] = val;
    b_++;
}

template<typename T>
T ArrayQueue<T>::Dequeue() {
    // 取出位於 head_ 的元素
    T ans = data_[a_];
    // 更新 head_ 指向下一個位置（模運算保證循環）
    a_ = (a_ + 1) % data_.size();
    b_--;
    return ans;
}
```

### Outcome

Second Attempt: AC.
